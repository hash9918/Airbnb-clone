const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Place = require("./models/place");
const Booking = require("./models/booking");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const imageDownloader = require("image-downloader");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "kdasfjoqpihhnfvamlnvok1209r8";

const app = express();
//here we have a middleware for displaying the contents of the image downloaded earlier using link
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(cookieParser());

// database;
// mongoose
//   .connect(
//     "mongodb+srv://strioathi6416:r9E9gsLEk3k0VKDf@cluster0.shc3r23.mongodb.net/?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("connection succesfull");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

mongoose
  .connect("mongodb://127.0.0.1/airbnb")
  .then(() => {
    console.log("connection succesfull");
  })
  .catch((e) => {
    console.log(e);
  });

//function to get token from client and authenticate
function getUserDataFromReq(req) {
  const { token } = req.cookies;
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      await resolve(userData);
    });
  });
}

//endpoints
app.get("/test", (req, res) => {
  res.json("test ok ok ok");
});
//register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userc);
  } catch (e) {
    res.status(422).json(e);
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userc = await User.findOne({ email });
  if (userc) {
    const passok = bcrypt.compareSync(password, userc.password);
    if (passok) {
      jwt.sign(
        { email: userc.email, id: userc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .json(userc);
        } //here what we are doing is creating a token for a user using his email and id and a jwtkey for creating it,after it is created a callback function is called where the token generated is there which is send back over to the client's browser to be stored and be checked by below api call
      );
    } else {
      res.status(401).json("passnotok");
    }
  } else {
    res.status(401).json("not found");
  }
});

//here the client sends its token through cookie and it is verified by the jwt using jwtkey, if the token is correct it will return the data which was used to create the token i.e the email and id which can be searched in db to find the user and return his info to the client back
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(data.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

//here we are sending the cookie as empty when we get the request from user to log out hence no cookie would be there and the user will not be loged in
app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json(true);
});

//api for image download via link
//this should be remembered spend about 3 hours on a single bug but at last solved it by myself only
//the problem was when the link was send it was immmediatley responsed back with the newname where the image was still downloading in msec
//at the same time in placespage the the value was set to addedphotos and then the map was called but the image was not available at that point
//we have set the newname which was kept for the image and also send to the placespage
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  console.log(link);
  const newName = "photo" + Date.now() + ".jpg";

  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  console.log(newName);
  res.json(newName);
});

//api for upload from the user input file
//here when the frontend sends the files it goes through the middleware and firstly saves them in the dest after that the res sends that image back over to the frontend where it adds it to the addedphotos array and renders it in the page
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  console.log(req.files);
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];

    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    console.log(path);

    console.log(newPath);

    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }

  res.json(uploadedFiles);
});

//endpoint for setting saving the places data in db
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  //to grab the user id for the particular user and store according to it will be required during fetch
  //here the usedata is returned from the jwt dont confuse
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

//endpoint to get the places stored in db int the palcespage
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;

  //to grab the user id
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

//endpoint to get  the saved places in the places form page
//also use it for the place page where we get info about individual place
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await Place.findById(id));
  } catch (e) {
    console.log(e);
  }
});

//endpoint to update the place in the db from placesform page
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    mobile,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        mobile,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

//endpoint to get all the places available in db irrespective of saved by users onto the index page
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

//endpoint for adding the booking name and phone number
app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, mobile, price } =
    req.body;
  const response = await Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    user: userData.id,
    mobile,
    price,
  });

  res.json(response);
});

//endpoint for getting all the booking for a user
//study populate
app.get("/bookings", async (req, res) => {
  const user = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: user.id }).populate("place"));
});

app.listen(4000, () => {
  console.log("server is running");
});

const user = "strioathi6416";
const pass = "r9E9gsLEk3k0VKDf";
