import Message from "../../models/Message.model.js";

class MessageService {

    static async getUsersForSidebar(loggedInUserId) {
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return filteredUsers;
    };

    static async getMessages(userToChatId, myId) {
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        // $or: [...] allows us to specify multiple conditions, and MongoDB will return documents that match either condition.

        return messages;
    };

    static async sendMessage() {
        let imageUrl;
      if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();

      return newMessage;
    };
};

export default MessageService;