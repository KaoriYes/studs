app.get("/MatchPage", async (req, res) => {
  try {
    const likes = await Profile.find({
      //   liked: true,
    });
    res.render("MatchPage.ejs", {
      //   likesList: likes
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/like/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await Profile.findByIdAndUpdate(
      id,
      {
        liked: false,
      },
      {
        new: true,
      }
    );
    res.redirect("/liked");
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/unlike/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await Profile.findByIdAndUpdate(
      id,
      {
        liked: true,
      },
      {
        new: false,
      }
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/index", async (req, res) => {
  try {
    const likes = await Profile.find({
      liked: false,
    });
    res.render("index.ejs", {
      likesList: likes,
      active: active,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
