'use strict'

bulmaToast.setDefaults({
  position: 'bottom-center',
  closeOnClick: true,
  pauseOnHover: true,
  animate: {
    in: 'bounceInUp',
    out: 'bounceOutDown'
  }
})

const is = new Iamages("https://iamages.uber.space/iamages/api/v2")

// NOTE: remember to comment this once you're done working!
// is.changeAPIRoot("http://localhost:9999/iamages/api/v2")
