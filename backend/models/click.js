const mongoose = require("mongoose");

const Click = new mongoose.Schema(
  {
    latitude: {
        type: Number, 
    }, 

    longitude: {
        type: Number, 
    },
  }, 

  { 
    timestamps: true     
  }
)

mongoose.model("Click", Click); 
module.exports = Click;