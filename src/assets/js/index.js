'use strict'

let selectedImages = {}
const previewListElement = document.getElementById('preview-list')
const uploadedList = {
  container: document.getElementById('uploaded-list-container'),
  list: document.getElementById('uploaded-list'),
  closeButton: document.getElementById('close-uploaded-list-button')
}
const uploadingProgressElement = document.getElementById('uploading-progress')
let isUploading = false

function addPreviewCard (uuid) {
  let card = document.createElement('div')
  card.classList.add('card')
  card.id = 'selectedImage:' + uuid
  previewListElement.appendChild(card)

  let cardHeader = document.createElement('header')
  cardHeader.classList.add('card-header')
  card.appendChild(cardHeader)

  let cardHeaderTitle = document.createElement('p')
  cardHeaderTitle.classList.add('card-header-title')
  cardHeaderTitle.innerText = selectedImages[uuid].file.name
  cardHeader.appendChild(cardHeaderTitle)

  let cardImage = document.createElement('div')
  cardImage.classList.add('card-image')
  card.appendChild(cardImage)

  let cardImageFigure = document.createElement('figure')
  cardImageFigure.classList.add('image')
  cardImage.appendChild(cardImageFigure)

  let cardImageFigureImage = document.createElement('img')
  cardImageFigureImage.src = URL.createObjectURL(selectedImages[uuid].file)
  cardImageFigure.appendChild(cardImageFigureImage)

  let cardContent = document.createElement('div')
  cardContent.classList.add('card-content')
  card.appendChild(cardContent)

  let imageInformationField = document.createElement('div')
  imageInformationField.classList.add('field')
  cardContent.appendChild(imageInformationField)

  let imageInformationDescriptionInputControl = document.createElement('div')
  imageInformationDescriptionInputControl.classList.add('control', 'is-expanded')
  imageInformationField.appendChild(imageInformationDescriptionInputControl)

  let imageInformationDescriptionInput = document.createElement('input')
  imageInformationDescriptionInput.type = 'text'
  imageInformationDescriptionInput.id = 'iamages-description:' + uuid
  imageInformationDescriptionInput.classList.add('input', 'iamages-upload-disable')
  imageInformationDescriptionInput.placeholder = "No description yet."
  imageInformationDescriptionInput.onchange = function (e) {
    selectedImages[uuid].description = e.target.value
  }
  imageInformationDescriptionInputControl.appendChild(imageInformationDescriptionInput)

  imageInformationField.appendChild(document.createElement('br'))

  let imageInformationNSFWCheckboxControl = document.createElement('div')
  imageInformationNSFWCheckboxControl.classList.add('control')
  imageInformationField.appendChild(imageInformationNSFWCheckboxControl)

  let imageInformationNSFWCheckbox = document.createElement('input')
  imageInformationNSFWCheckbox.type = 'checkbox'
  imageInformationNSFWCheckbox.autocomplete = 'off'
  imageInformationNSFWCheckbox.id = 'iamages-isNSFW:' + uuid
  imageInformationNSFWCheckbox.classList.add('switch', 'is-danger', 'is-rounded', 'iamages-upload-disable')
  imageInformationNSFWCheckbox.onchange = function (e) {
    selectedImages[uuid].isNSFW = e.target.checked
  }
  imageInformationNSFWCheckboxControl.appendChild(imageInformationNSFWCheckbox)

  let imageInformationNSFWCheckboxLabel = document.createElement('label')
  imageInformationNSFWCheckboxLabel.htmlFor = 'iamages-isNSFW:' + uuid
  imageInformationNSFWCheckboxLabel.innerText = 'NSFW'
  imageInformationNSFWCheckboxControl.appendChild(imageInformationNSFWCheckboxLabel)

  let cardFooter = document.createElement('footer')
  cardFooter.classList.add('card-footer')
  card.appendChild(cardFooter)

  let cardFooterItemDelete = document.createElement('a')
  cardFooterItemDelete.classList.add('card-footer-item', 'is-unselectable')
  cardFooterItemDelete.innerText = 'Remove from queue'
  cardFooterItemDelete.onclick = function () {
    removePreviewCard(uuid)
  }
  cardFooter.appendChild(cardFooterItemDelete)

  previewListElement.append(document.createElement('br'))
}

function removePreviewCard (uuid) {
  if (!isUploading) {
    delete selectedImages[uuid]
    document.getElementById('selectedImage:' + uuid).remove()
  }
}

function addUploadedCard (id, description) {
  let card = document.createElement('div')
  card.classList.add('card')
  uploadedList.list.appendChild(card)

  let cardHeader = document.createElement('header')
  cardHeader.classList.add('card-header')
  card.appendChild(cardHeader)

  let cardHeaderTitle = document.createElement('p')
  cardHeaderTitle.classList.add('card-header-title')
  cardHeaderTitle.innerText = description
  cardHeader.appendChild(cardHeaderTitle)

  let cardImage = document.createElement('div')
  cardImage.classList.add('card-image')
  card.appendChild(cardImage)

  let cardImageFigure = document.createElement('figure')
  cardImageFigure.classList.add('image')
  cardImage.appendChild(cardImageFigure)

  let cardImageFigureImage = document.createElement('img')
  cardImageFigureImage.src = 'https://iamages.uber.space/iamages/api/thumb/' + id
  cardImageFigure.appendChild(cardImageFigureImage)

  let cardFooter = document.createElement('footer')
  cardFooter.classList.add('card-footer')
  card.appendChild(cardFooter)

  let cardFooterItemEmbedLink = document.createElement('a')
  cardFooterItemEmbedLink.classList.add('card-footer-item', 'is-unselectable')
  cardFooterItemEmbedLink.innerText = 'Link to embed'
  cardFooterItemEmbedLink.target = '_blank'
  cardFooterItemEmbedLink.href = 'https://iamages.uber.space/iamages/api/embed/' + id
  cardFooter.appendChild(cardFooterItemEmbedLink)

  uploadedList.list.appendChild(document.createElement('br'))
}

document.getElementById('select-images-input').onchange = function (e) {
  for (const selectedImage of e.target.files) {
    const selectedImageUUID = uuidv4()
    selectedImages[selectedImageUUID] = {
      description: '',
      isNSFW: false,
      file: selectedImage
    }
    addPreviewCard(selectedImageUUID)
  }
}

document.getElementById('upload-images-button').onclick = function (e) {
  function logError(error) {
    console.error(error)
    bulmaToast.toast({
      message: error,
      type: 'is-danger'
    })
  }

  isUploading = true

  for (let disableElement of document.getElementsByClassName('iamages-upload-disable')) {
    disableElement.disabled = true
  }

  uploadedList.list.innerHTML = ''
  uploadedList.container.classList.remove('is-hidden')

  const selectedImagesKeys = Object.keys(selectedImages)
  let selectedImagesCurrentPosition = 0

  for (const uuid of selectedImagesKeys) {
    selectedImagesCurrentPosition++
    const reader = new FileReader()
    reader.readAsDataURL(selectedImages[uuid].file)
    reader.onload = function () {
      fetch('https://iamages.uber.space/iamages/api/upload', {
        method: 'PUT',
        body: JSON.stringify({
          FileDescription: selectedImages[uuid].description,
          FileNSFW: selectedImages[uuid].isNSFW,
          FileData: reader.result.split(',')[1]
        })
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not OK!')
        }
        return response.json()
      }).then(function (parsed) {
        const backupDescription = selectedImages[uuid].description
        removePreviewCard(uuid)
        addUploadedCard(parsed.FileID, backupDescription)
      }).catch(function (error) {
        logError(error)
      })
    }
    reader.onerror = function (error) {
      logError(error)
    }
    uploadingProgressElement.value = (selectedImagesCurrentPosition / selectedImagesKeys.length) * 100
  }

  setTimeout(function () {
    uploadingProgressElement.value = 0
  }, 3000)

  for (let disableElement of document.getElementsByClassName('iamages-upload-disable')) {
    disableElement.disabled = false
  }

  isUploading = false
}

uploadedList.closeButton.onclick = function () {
  uploadedList.container.classList.add('is-hidden')
}
