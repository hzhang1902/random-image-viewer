"use strict";

const uploadButton = document.getElementById("upload");
const reelUploadButton = document.getElementById("reel");
const image = document.getElementById("image");
const imageDiv = document.getElementById("imageDiv");
const refreshButton = document.getElementById("refresh");
const indexText = document.getElementById("indexText");
let shower, images;
let traversing = false;


uploadButton.onclick = (evt) => {
  reelUploadButton.click();
}

refreshButton.onclick = (evt) => {
  refresh();
}

window.onload = function () {
  reelUploadButton.addEventListener('change', loadDir, false);
}

window.onkeydown = function (e) {
  if (!shower) return;
  var key = e.keyCode ? e.keyCode : e.which;
  if (key == 37 || key == 38) {
    shower.prevImage();
    // traverse(shower, shower.prevImage)
  } else if (key == 39 || key == 40) {
    shower.nextImage();
    // traverse(shower, shower.nextImage)
  }
}

// window.onkeyup = function (e) {
//   if (!shower) return;
//   var key = e.keyCode ? e.keyCode : e.which;
//   if (key == 37 || key == 38) {
//     // shower.prevImage();
//     traversing = false;
//   } else if (key == 39 || key == 40) {
//     // shower.nextImage();
//     traversing = false;
//   } else if (key == 82) {
//     refresh();
//   }
// }

// function traverse (thisArg, action) {
//   // setTimeout(()=>{
//     traversing = true;
//     const handlerIndex = setInterval(()=>{
//       console.log("called")
//       if (traversing) action.call(thisArg)
//       else clearInterval(handlerIndex)
//     }, 500)
//   // }, 500)
// }

class NoDuplicateRandomNumberGenerator {
  constructor(max) {
    this.max = max;
    this.available = [...Array(this.max).keys()];
  }

  getNextRand() {
    const len = this.available.length;
    if (len <= 0) {
      return null;
    }
    const randIndex = this.getRandomInt(len);
    const randNum = this.available[randIndex];
    this.available.splice(randIndex, 1);
    return randNum;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

class ImageShower {
  constructor(images) {
    this.images = images;
    this.len = this.images.length;
    this.currentIndex = 0;
    this.reader = new FileReader();
    this.reader.onload = this.imageHandler;
  }

  firstImage() {
    this.currentIndex = 0;
    this.showImage(this.currentIndex);
  }

  nextImage() {
    if (this.currentIndex < this.len) {
      this.currentIndex++;
    }
    if (this.currentIndex >= this.len) {
      imageDiv.innerHTML = `<p style="color:white;">end</p>`;
    } else {
      this.showImage(this.currentIndex);
    }
  }

  prevImage() {
    if (this.currentIndex >= 0) {
      this.currentIndex--;
    }
    if (this.currentIndex < 0) {
      imageDiv.innerHTML = `<p style="color:white;">start</p>`;
    } else {
      this.showImage(this.currentIndex);
    }
  }

  setImage(image) {
    imageDiv.innerHTML = '<img id="image" src="' + image + '">';
  }

  showImage(index) {
    indexText.innerText = index;
    const image = this.images[index];
    this.setImage(image);
  }
}




function loadDir(e1) {
  const files = reelUploadButton.files;
  images = [];

  const loadPromises = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name.endsWith(".jpg")
      || file.name.endsWith(".jpeg")
      || file.name.endsWith(".png")
      || file.name.endsWith(".gif")) {

      const promise = new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (image) => {
          images.push(image.target.result);
          resolve();
        }
        fr.readAsDataURL(file);
      })
      loadPromises.push(promise);
    }
  }
  Promise.all(loadPromises)
  .then(()=>{
    refresh();
  })
}


function refresh() {
  if (!images) return;
  const numImages = images.length;
  const randGen = new NoDuplicateRandomNumberGenerator(numImages);
  const randomImages = [];
  images.forEach(() => {
    randomImages.push(images[randGen.getNextRand()]);
  })
  shower = new ImageShower(randomImages);
  shower.firstImage();
}