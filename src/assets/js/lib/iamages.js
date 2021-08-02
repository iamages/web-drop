'use strict'

class Iamages {
  constructor(apiRoot) {
    this.apiRoot = apiRoot
  }

  async _fetchRequest(type, path, headers, body) {
    var fetchObj = {
      method: type,
    }
    if (headers != undefined) {
      fetchObj["headers"] = headers
    }
    if (body != undefined) {
      fetchObj["body"] = body
    }
    const response = await fetch(`${this.apiRoot}/${path}`, fetchObj)
    return await response.json()
  }

  _getUploadForm(obj) {
    var form = new FormData()
    form.set("description", obj.description)
    form.set("nsfw", obj.nsfw)
    form.set("hidden", obj.hidden)
    return form 
  }

  changeAPIRoot(apiRoot) {
    this.apiRoot = apiRoot
  }

  async upload(obj) {
    var form = this._getUploadForm(obj)
    form.set("upload_file", obj.upload_file)
    return await this._fetchRequest("POST", "upload", obj.auth, form)
  }

  async websave(obj) {
    var form = this._getUploadForm(obj)
    form.set("upload_url", obj.upload_url)
    return await this._fetchRequest("POST", "websave", obj.auth, form)
  }
}
