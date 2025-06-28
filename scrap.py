import requests
from bs4 import BeautifulSoup
import time
import os
from PIL import Image
from io import BytesIO

url = "https://kpopping.com/kpics/gender-all/category-any/idol-D-O/group-any/order-new"
topic = "DO"
headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Find all <a> tags with aria-label="picture" and get their href
links = [
    a['href']
    for cell in soup.find_all('div', class_='cell')
    for figure in cell.find_all('figure')
    for a in figure.find_all('a', attrs={'aria-label': 'picture'})
    if 'href' in a.attrs
]
i = 0

print(f"Found {len(soup.find_all('div', class_='cell'))} cells")

for link in links[:30]:
    i += 1
    print(f"Checking link ({i}/{len(links)}): ", link)
    url = "https://kpopping.com" + link
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    gallery = soup.find(class_="justified-gallery")
    if gallery:
        answer = str(gallery)
    else:
        answer = ""

    if gallery:
        images = gallery.find_all('img')
        img_count = 0
        for img in images:
            img_url = img.get('src')
            if img_url:
                if not img_url.startswith('http'):
                    img_url = "https://kpopping.com" + img_url
                img_name = img_url.split("/")[-1].split("?")[0]

                img_name = os.path.splitext(img_name)[0] + ".jpg"
                folder = "dataset/" + topic
                os.makedirs(folder, exist_ok=True)
                img_path = os.path.join(folder, img_name)
                try:
                    img_data = requests.get(img_url, headers=headers).content

                    img = Image.open(BytesIO(img_data)).convert("RGB")
                    img.save(img_path, "JPEG")
                    print(f"Downloaded {img_name}")
                except Exception as e:
                    print(f"Failed to download {img_url}: {e}")
                img_count += 1
                if img_count % 10 == 0:
                    time.sleep(2)

