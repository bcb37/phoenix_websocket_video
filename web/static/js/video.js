export default class Video {

  static start(username, chan) {
    Webcam.set({
      width: 320,
      height: 240,
      dest_width: 320,
      dest_height: 240,
      image_format: 'jpeg',
      jpeg_quality: 50,
      force_flash: false,
      //flip_horiz: true,
      fps: 20,
    })

    var stream= (username, chan) => {
      Webcam.snap(data_uri => {
        chan.push("new:msg", {user: username, body: data_uri})
      })
      var callback = () => {
        stream(username, chan)
      }
      window.setTimeout(callback, 50)
      //requestAnimationFrame(callback)
    }

    Webcam.on('live', () => { stream(username, chan) })

    Webcam.attach('#my_webcam')
  }


}


