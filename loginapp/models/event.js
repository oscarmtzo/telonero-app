const { model, Schema } = require("mongoose");
const eventSchema = new Schema(
  {
    name: String,
    description: String,
    fecha: String,
    latitud: Number,
    longitud: Number
  },
  {
    timestamps: true
  }
);

const Event = model("Event", eventSchema);
module.exports = Event;
