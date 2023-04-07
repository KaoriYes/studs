require("dotenv").config();

const express = require("express");
const router = express.Router();

//database verbinden
const { MongoClient, ServerApiVersion } = require("mongodb");
const { addAbortSignal } = require("stream");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const { ObjectId } = require("mongodb");
const multer = require("multer");
const upload = multer({
  dest: "public/uploads/",
});
// In-memory store for themes
let col_thema = [];
let randomQuote;

col_thema.forEach((theme) => {
  console.log(theme);
});

//vakken datsase
const databaseVakken = client.db("studsdb");
const collectionVakken = databaseVakken.collection("col_vakken");
//users database
const databaseUsers = client.db("studsdb");
const collectionUsers = databaseUsers.collection("col_users");

//col voor de studs
const databaseStuds = client.db("studsdb");
const collectionStuds = databaseStuds.collection("col_studs");
//col voor de thema's
const collection = client.db("studsdb").collection("col_thema");

router.get("/themaAanpassen", async (req, res) => {
  if (!collection) {
    return res.status(500).send("Unable to connect to database");
  }
  try {
    const user1 = req.session.user.email;
    const user = await collectionUsers.findOne({
      email: user1,
    });
    const selectedVakken = user.selectedVakken;
    const renderData = await collection
      .find({
        user: req.session.user.email,
      })
      .toArray();
    res.render("theme-builder", {
      col_thema: renderData,
      user,
      selectedVakken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve themes");
  }
});

router.post("/nieuwThema", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const { body, file } = req;
  const theme = {
    _id: body.id,
    name: body.name,
    backgroundColor: body.color,
    fontFamily: body.font,
    textColor: body["font-color"],
    images: file.filename,
    thumbnailUrl: `/public/uploads/${file.filename}`,
    user: req.session.user.email,
    active: "",
  };

  try {
    await insertTheme(theme);
    try {
      const user1 = req.session.user.email;
      const user = await collectionUsers.findOne({
        email: user1,
      });
      const selectedVakken = user.selectedVakken;
      const renderData = await collection
        .find({
          user: req.session.user.email,
        })
        .toArray();
      res.redirect("matchPage2");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to retrieve themes");
    }
  } catch (err) {
    res.status(500).send({
      error: "Failed to save theme",
    });
  }
});

router.post("/updateTheme", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const renderData = await collection
    .find({
      user: user1,
    })
    .toArray();
  const selectedVakken = user.selectedVakken;
  const selectedStuds = await collectionStuds
    .find({
      vakken: {
        $in: selectedVakken,
      },
    })
    .toArray();
  const themeId = req.body.themeId;
  const themeID = await collection.findOne({
    _id: new ObjectId(themeId),
  });
  console.log(themeID);
  theme = themeID;
  res.render("matchPage-2.ejs", {
    col_thema: renderData,
    theme,
    randomQuote,
    user,
    selectedStuds,
    selectedVakken,
  });
});

router.get("/col_thema/:themeID", async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send("Unable to connect to database");
    }
    const response = await fetch(
      "https://opensheet.elk.sh/1er1dtNi_p5eKmqi70bGZLywuDzyce32JqzrywE57gU8/Blad1"
    );
    const quotes = await response.json();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].texts;

    const id = req.params.themeID;
    const theme = await collection.findOne({
      _id: new ObjectId(id),
    });
    const user1 = req.session.user.email;
    const user = await collectionUsers.findOne({
      email: user1,
    });
    const renderData = await collection
      .find({
        user: user1,
      })
      .toArray();
    res.render("theme-builder2", {
      col_thema: renderData,
      theme,
      randomQuote,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve theme");
  }
});

router.delete("/col_thema/:themeID", async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send("Unable to connect to database");
    }

    const id = req.params.themeID;
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).send("Theme not found");
    }

    res.redirect("/theme/themaAanpassen");
  } catch (err) {
    console.error(err);

    res.status(500).send("Failed to delete theme");
  }
});

router.get("/col_thema/:id", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const theme = await collection.findOne({
    _id: ObjectId(req.params.id),
    user,
  });
  res.render("theme-builder2", {
    theme,
    col_thema,
    user,
  });
});

router.get("/form", (req, res) => {
  res.render("form.ejs");
});

router.get("/matchpage2", async (req, res) => {
  const { body, file } = req;
  const theme = {
    _id: body.id,
    name: body.name,
    backgroundColor: body.color,
    fontFamily: body.font,
    textColor: body["font-color"],
    user: req.session.user.email,
  };
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const selectedVakken = user.selectedVakken;
  const selectedStuds = await collectionStuds
    .find({
      vakken: {
        $in: selectedVakken,
      },
    })
    .toArray();
  console.log(selectedVakken);

  try {
    const user1 = req.session.user.email;
    const user = await collectionUsers.findOne({
      email: user1,
    });
    const renderData = await collection
      .find({
        user: req.session.user.email,
      })
      .toArray();
    res.render("matchPage-2.ejs", {
      col_thema: renderData,
      theme,
      randomQuote,
      user,
      selectedStuds,
      selectedVakken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve themes");
  }
});

router.post("/nieuwThema", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const { body, file } = req;
  const theme = {
    _id: body.id,
    name: body.name,
    backgroundColor: body.color,
    fontFamily: body.font,
    textColor: body["font-color"],
    images: file.filename,
    thumbnailUrl: `/public/uploads/${file.filename}`,
    user: req.session.user.email,
    active: "",
  };

  try {
    await insertTheme(theme);
    try {
      const user1 = req.session.user.email;
      const user = await collectionUsers.findOne({
        email: user1,
      });
      const selectedVakken = user.selectedVakken;
      const renderData = await collection
        .find({
          user: req.session.user.email,
        })
        .toArray();
      res.redirect("matchPage2");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to retrieve themes");
    }
  } catch (err) {
    res.status(500).send({
      error: "Failed to save theme",
    });
  }
});

router.delete("/col_thema/:themeID", async (req, res) => {
  try {
    if (!collection) {
      return res.status(500).send("Unable to connect to database");
    }

    const id = req.params.themeID;
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).send("Theme not found");
    }

    res.redirect("/themaAanpassen");
  } catch (err) {
    console.error(err);

    res.status(500).send("Failed to delete theme");
  }
});

router.get("/col_thema/:id", async (req, res) => {
  const user1 = req.session.user.email;
  const user = await collectionUsers.findOne({
    email: user1,
  });
  const theme = await collection.findOne({
    _id: ObjectId(req.params.id),
    user,
  });
  res.render("theme-builder2", {
    theme,
    col_thema,
  });
});

// Insert a new theme into the database
async function insertTheme(theme) {
  try {
    
    const result = await collection.insertOne(theme);
    console.log("Theme saved to database:", theme);
    col_thema.push(theme);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = router;
