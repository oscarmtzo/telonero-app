const { model, Schema } = require("mongoose");
const eventSchema = new Schema(
  {
    name: String,
    description: String,
    fecha: String,
    location: {
      address: {
        type: String,
        default: "Point"
      },
      coordinates: [Number]
    }
  },
  {
    timestamps: true
  }
);

const Event = model("Event", eventSchema);
module.exports = Event;
