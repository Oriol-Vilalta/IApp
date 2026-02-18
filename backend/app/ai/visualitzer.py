"""Note:
    Parts of this code are adapted from the book "Deep Learning for Coders with fastai and PyTorch"
    by Jeremy Howard and Sylvain Gugger.
"""
import os
import matplotlib.pyplot as plt
import torch
from fastai.torch_basics import TensorImage
from fastcore.basics import first
from ..utils.logger import logger
# This file contains utility functions for visualizing model predictions and gradients.

# -------------------
# HOOKS
# -------------------

# Hooks are used to capture intermediate activations or gradients from model layers during forward or backward passes.
class Hook:
    def __init__(self, m):
        self.hook = m.register_forward_hook(self.hook_func)

    def hook_func(self, m, i, o): self.stored = o.detach().clone()

    def __enter__(self, *args): return self

    def __exit__(self, *args): self.hook.remove()


# HookBwd is a specialized hook for capturing gradients during the backward pass.
# This is useful for techniques like Grad-CAM where gradients are needed to compute the class activation maps.
class HookBwd:
    def __init__(self, m):
        self.hook = m.register_backward_hook(self.hook_func)

    def hook_func(self, m, gi, go): self.stored = go[0].detach().clone()

    def __enter__(self, *args): return self

    def __exit__(self, *args): self.hook.remove()

# -------------------
# HEATMAPS 
# -------------------

# UNUSED
# This function generates a heatmap using Class Activation Mapping (CAM) for a given image and model.
def heatmap_cam(learner, img, dls, path):
    device = next(learner.model.parameters()).device

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



# grad_cam generates a Grad-CAM heatmap for a given image and model.
# It uses hooks to capture activations and gradients from the target layer during forward and backward passes.
# The resulting heatmap highlights regions in the image that are important for the model's prediction.
def grad_cam(learner, img, dls, path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Generating CAM heatmap on device: {device}")

    learner.model.to(device)
    learner.model.eval()
    learner.model.zero_grad(set_to_none=True)

    x, = first(dls.test_dl([img]))
    x = x.to(device)

    cls = 1  # target class index

    with torch.enable_grad():
        with HookBwd(learner.model[0]) as hookg:
            with Hook(learner.model[0]) as hook:
                output = learner.model.eval()(x.to(device))
                act = hook.stored

            output[0, cls].backward()
            grad = hookg.stored

    # Grad-CAM computation
    w = grad[0].mean(dim=(1, 2), keepdim=True)
    cam_map = (w * act[0]).sum(0)
    cam_map = torch.relu(cam_map)

    # Visualization
    _, ax = plt.subplots()

    x_dec = TensorImage(dls.train.decode((x.cpu(),))[0][0])
    x_dec.show(ctx=ax)

    ax.imshow(
        cam_map.detach().cpu(),
        alpha=0.6,
        extent=(0, 224, 224, 0),
        interpolation='bilinear',
        cmap='magma'
    )

    plt.savefig(os.path.join(path, "grad-cam.png"))
    plt.close()

# -------------------
# PROBABILITY GRAPH
# -------------------

# It is called probability graph to the distribution of the probabilities of the classes on a prediction.
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
