import os
import matplotlib.pyplot as plt
import torch
from fastai.torch_basics import TensorImage
from fastcore.basics import first


class Hook:
    def __init__(self, m):
        self.hook = m.register_forward_hook(self.hook_func)

    def hook_func(self, m, i, o): self.stored = o.detach().clone()

    def __enter__(self, *args): return self

    def __exit__(self, *args): self.hook.remove()


class HookBwd:
    def __init__(self, m):
        self.hook = m.register_backward_hook(self.hook_func)

    def hook_func(self, m, gi, go): self.stored = go[0].detach().clone()

    def __enter__(self, *args): return self

    def __exit__(self, *args): self.hook.remove()


def heatmap_cam(learner, img, dls, path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # Move model to device
    learner.model.to(device)
    x, = first(dls.test_dl([img]))
    x = x.to(device)

    class Hook():
        def hook_func(self, m, i, o): self.stored = o.detach().clone()

    hook_output = Hook()
    hook = learner.model[0].register_forward_hook(hook_output.hook_func)
    with torch.no_grad():
        learner.model.eval()(x)
    act = hook_output.stored[0]

    # cam_map = torch.einsum('ck,kij->cij', learner.model[1][-1].weight, act)
    try:
        cam_map = torch.einsum('oc,ckw->okw', learner.model[1][-1].weight.to(device), act)
    except RuntimeError:
        hook.remove()
        return None

    x_dec = TensorImage(dls.train.decode((x.cpu(),))[0][0])
    _, ax = plt.subplots()
    x_dec.show(ctx=ax)
    ax.imshow(cam_map[1].detach().cpu(), alpha=0.6, extent=(0, 224, 224, 0), interpolation='bilinear', cmap='magma')

    hook.remove()

    plt.savefig(os.path.join(path, "heatmap.webp"))
    plt.close()


def grad_cam(learner, img, dls, path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    learner.model.to(device)
    x, = first(dls.test_dl([img]))
    x = x.to(device)
    cls = 1
    with HookBwd(learner.model[0]) as hookg:
        with Hook(learner.model[0]) as hook:
            output = learner.model.eval()(x)
            act = hook.stored
        output[0, cls].backward()
        grad = hookg.stored

    w = grad[0].mean(dim=[1, 2], keepdim=True)
    cam_map = (w * act[0]).sum(0)

    _, ax = plt.subplots()
    x_dec = TensorImage(dls.train.decode((x.cpu(),))[0][0])
    x_dec.show(ctx=ax)
    ax.imshow(cam_map.detach().cpu(), alpha=0.6, extent=(0, 224, 224, 0), interpolation='bilinear', cmap='magma')

    plt.savefig(os.path.join(path, "grad-cam"))
    plt.close()


def get_prob_graph(probs, vocab, path):
    plt.figure(figsize=(7, 4))
    plt.barh(vocab, probs, color='skyblue')
    plt.xlabel('Probability')
    plt.title('Predicted Probabilities')
    plt.xlim(0, 1)
    plt.grid(axis='x', linestyle='--', alpha=0.7)

    data = {}
    for index in range(len(vocab)):
        data[vocab[index]] = probs[index]

    plt.savefig(os.path.join(path, "prob_graph"))
