import Pusher from "pusher";
const pusher = new Pusher({
  appId: "1989700",
  key: "0c618ac49a9595222baa",
  secret: "4f5931eaba9f90453993",
  cluster: "eu",
  useTLS: true
});

export default pusher;


// app_id = "1989700"
// key = "0c618ac49a9595222baa"
// secret = "4f5931eaba9f90453993"
// cluster = "eu"