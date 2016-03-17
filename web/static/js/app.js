import {Socket, LongPoller} from "phoenix"
import Video from './video'

class App {
  constructor() {
    this.images = {}
  }

  init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => {})
    })

    socket.connect({user_id: "123"})
    var $username  = $("#username")

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("rooms:lobby", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    chan.on("new:msg", msg => {
      if (msg.user !== 'SYSTEM') {
        this.updateVideo(msg)
      }
    })

    $('button').click( e => {
      var username = $username.val()
      if (username === '') {
        console.log('select an username first')
      } else {
        Video.start(username, chan)
      }
    })
  }

  updateVideo(msg) {
    var $img = this.getOrCreateVideo(msg.user)
    $img.attr('src', msg.body)
  }

  getOrCreateVideo(username) {
    var $img = this.images[username]

    if (!$img) {
      var $video = this.videoTemplate(username)
      $('#videos').append($video)
      $img = $video.find('img')
      this.images[username] = $img
    }
    return $img
  }

  videoTemplate(username){
    return $(`<div id='${username}' class='video'><img></div>`)
  }

}

$( () => (new App()).init() )

export default App
