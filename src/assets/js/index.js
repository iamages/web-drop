'use strict'

var selectedFile = {
  type: null,
  file: null
}

const uploadModal = {
  controller: new BulmaModal("#upload-modal"),
  head: {
    closeButton: document.getElementById("upload-modal-close-button")
  },
  detailsPage: {
    page: document.getElementById("upload-modal-details-page"),
    body: {
      img: document.getElementById("upload-modal-img"),
      descriptionInput: document.getElementById("upload-modal-description-input"),
      nsfwToggle: document.getElementById("upload-modal-nsfw-toggle"),
      hiddenToggle: document.getElementById("upload-modal-hidden-toggle")
    }
  },
  completePage: {
    page: document.getElementById("upload-modal-complete-page"),
    body: {
      shareButton: document.getElementById("upload-modal-share-button"),
      copyButton: document.getElementById("upload-modal-copy-button"),
      goButton: document.getElementById("upload-modal-go-button")
    }
  },
  foot: {
    uploadButton: document.getElementById("upload-modal-upload-button")
  }
}

uploadModal.controller.addEventListener("modal:close", () => {
  uploadModal.detailsPage.page.classList.remove("is-hidden")
  uploadModal.completePage.page.classList.add("is-hidden")

  uploadModal.detailsPage.body.img.src = ""
  uploadModal.detailsPage.body.descriptionInput.value = ""
  uploadModal.detailsPage.body.nsfwToggle.value = false
  uploadModal.detailsPage.body.hiddenToggle.value = false

  uploadModal.foot.uploadButton.classList.remove("is-loading")
  uploadModal.foot.uploadButton.classList.remove("is-hidden")
})

uploadModal.completePage.body.shareButton.onclick = async (e) => {
  await navigator.share({ url: e.target.getAttribute("data-iamages-url") })
}

uploadModal.completePage.body.copyButton.onclick = async (e) => {
  await navigator.clipboard.writeText(uploadModal.completePage.body.copyButton.getAttribute("data-iamages-url"))
}

async function upload() {
  uploadModal.head.closeButton.classList.add("is-hidden")
  uploadModal.foot.uploadButton.classList.add("is-loading")

  var obj = {
    description: "No description yet.",
    nsfw: uploadModal.detailsPage.body.nsfwToggle.checked,
    hidden: uploadModal.detailsPage.body.hiddenToggle.checked
  }
  if (uploadModal.detailsPage.body.descriptionInput.value !== "") {
    obj["description"] = uploadModal.detailsPage.body.descriptionInput.value
  }

  var fileInformation = {
    id: "unknown"
  }

  try {
    switch (selectedFile.type) {
      case "file":
        var form = new FormData()
        form.set("info", JSON.stringify(obj))
        form.set("upload_file", selectedFile.file)
        var response = await fetch(apiRoot + "/file/new/upload", {
          method: "POST",
          body: form
        })
        fileInformation = await response.json()
        break
      case "url":
        obj["upload_url"] = selectedFile.file
        var response = await fetch(apiRoot + "/file/new/websave", {
          method: "POST",
          body: JSON.stringify(obj)
        })
        fileInformation = await response.json()
        break
    }
  } catch (err) {
    console.error(err)
    bulmaToast.toast({
      type: "is-danger",
      message: err
    })
  }
  const shareURL = `${apiRoot}/file/${fileInformation.id}/embed`
  uploadModal.completePage.body.shareButton.setAttribute("data-iamages-url", shareURL)
  uploadModal.completePage.body.copyButton.setAttribute("data-iamages-url", shareURL)
  uploadModal.completePage.body.goButton.href = shareURL

  uploadModal.foot.uploadButton.classList.remove("is-loading")
  uploadModal.foot.uploadButton.classList.add("is-hidden")
  uploadModal.head.closeButton.classList.remove("is-hidden")

  uploadModal.detailsPage.page.classList.add("is-hidden")
  uploadModal.completePage.page.classList.remove("is-hidden")
}

uploadModal.foot.uploadButton.onclick = upload

document.getElementById("upload-file-input").onchange = (e) => {
  selectedFile.type = "file"
  selectedFile.file = e.target.files[0]
  const url = URL.createObjectURL(selectedFile.file)
  uploadModal.detailsPage.body.img.src = url
  uploadModal.detailsPage.body.img.alt = url
  uploadModal.controller.show()
}

function showUploadModalUsingUrl() {
  const url = document.getElementById("upload-url-input").value
  if (url == "") return
  uploadModal.detailsPage.body.img.src = url
  uploadModal.detailsPage.body.img.alt = url
  selectedFile.type = "url"
  selectedFile.file = url
  uploadModal.controller.show()
}

document.getElementById("upload-url-next-button").onclick = showUploadModalUsingUrl
document.getElementById("upload-url-input").onkeyup = (e) => {
  switch (e.key) {
    case "Enter":
      showUploadModalUsingUrl()
      break
  }
}

if (!navigator.share) uploadModal.completePage.body.shareButton.classList.add("is-hidden")
