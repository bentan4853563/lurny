/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Lurny = require("../../models/Lurny");

const processHashtags = require("../../test");

router.get("/get", async (req, res) => {
  try {
    const lurnies = await Lurny.find().sort({ date: -1 }).populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/currents", async (req, res) => {
  try {
    const lurnies = await Lurny.find({ shared: true })
      .sort({ date: -1 })
      .limit(100)
      .populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/my-lurnies", async (req, res) => {
  try {
    const lurnies = await Lurny.find({ user: req.body.user })
      .sort({
        date: -1,
        shared: 1,
      })
      .populate("user");
    res.json(lurnies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/insert", async (req, res) => {
  try {
    const newLurnies = req.body;

    // for (const lurny of newLurnies) {
    //   const newCollections = await processHashtags(lurny["collections"]);
    //   lurny.collections = newCollections;
    // }

    const savedLurny = await Lurny.insertMany(newLurnies);

    const populatedLurniesPromises = savedLurny.map((lurny) =>
      Lurny.findById(lurny._id).populate("user")
    );

    const populatedLurnies = await Promise.all(populatedLurniesPromises);
    res.status(201).json(populatedLurnies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/share/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Lurny.findByIdAndUpdate(
      id,
      { shared: true }, // Set sharedField to true
      { new: true }
    );

    if (!result) {
      return res.status(404).send("Document shared.");
    }

    res.send(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/share-many", async (req, res) => {
  try {
    const { groupKey } = req.body;
    const fields = groupKey.split("|");
    const dateString = fields[0];
    const user = fields[1];
    const url = fields[2];

    // First update the documents.
    const updateResult = await Lurny.updateMany(
      {
        user,
        url,
        date: {
          $gte: new Date(`${dateString}.000Z`),
          $lt: new Date(`${dateString}.999Z`),
        },
      },
      { shared: true } // Set shared field to true
    );

    // If no documents were modified, send a 404 response
    if (!updateResult || updateResult.nModified === 0) {
      return res.status(404).send("No documents found for sharing.");
    }

    // After successful update, find and return the updated documents.
    const updatedLurnies = await Lurny.find({
      user,
      url,
      date: {
        $gte: new Date(`${dateString}.000Z`),
        $lt: new Date(`${dateString}.999Z`),
      },
      shared: true, // Assuming 'shared' property is used to find updated documents
    }).populate("user");

    // Send back the updated documents
    res.send(updatedLurnies);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Lurny.findByIdAndDelete(id);

    res.send("Successfully deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete-cluster/:groupKey", async (req, res) => {
  try {
    const { groupKey } = req.params;
    console.log("groupKey :>> ", groupKey);
    const fields = groupKey.split("|");
    const dateString = fields[0];
    const user = fields[1];
    const url = fields[2];

    // Find the documents you want to delete and get their ids
    const lurniesToDelete = await Lurny.find(
      {
        user,
        url,
        date: {
          $gte: new Date(`${dateString}.000Z`),
          $lt: new Date(`${dateString}.999Z`),
        },
      },
      { _id: 1 }
    ); // Projection to only return the _id field
    console.log("lurniesToDelete :>> ", lurniesToDelete);
    // Extract the ids from the previous query result
    const idsToDelete = lurniesToDelete.map((lurny) => lurny._id);

    // Now, perform the delete operation if there are ids to delete
    if (idsToDelete.length > 0) {
      const deleteResult = await Lurny.deleteMany({
        _id: { $in: idsToDelete },
      });

      // Optional: Check deleteResult.deletedCount to see how many were deleted
      console.log(`${deleteResult.deletedCount} Lurnies have been deleted.`);
    }

    // Respond with the ids that were deleted
    res.send(idsToDelete);
  } catch (error) {
    console.error(error); // It's good practice to log the actual error
    res.status(500).send("Internal Server Error");
  }
});

// router.delete("/delete-stub", async (req, res) => {
//   try {
//     const { id, type, number } = req.body;

//     const lurny = await Lurny.findById(id);

//     const summary =
//       type === "stub"
//         ? lurny.summary.filter((lurny, index) => index !== number - 1)
//         : summary;
//     const quiz =
//       type === "quiz"
//         ? lurny.quiz.filter((lurny, index) => index !== number - 1)
//         : quiz;

//     Lurny.findByIdAndUpdate(id, summary, quiz);

//     res.send("Successfully deleted");
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

router.delete("/delete-stub", async (req, res) => {
  try {
    // Destructuring id, type, and number from the request body
    const { id, type, number } = req.body;
    const lurny = await Lurny.findById(id);
    let update = {};
    const indexToRemove = parseInt(number, 10); // ensure `number` is of type `Number`

    if (!isNaN(indexToRemove)) {
      if (type === "stub" && Array.isArray(lurny.summary)) {
        update.summary = lurny.summary.filter(
          (_, index) => index !== indexToRemove
        );
      } else if (type === "quiz" && Array.isArray(lurny.quiz)) {
        update.quiz = lurny.quiz.filter((_, index) => index !== indexToRemove);
      }
    }
    const updatedLurny = await Lurny.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("user");

    res.send(updatedLurny);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/clear-hash", async (req, res) => {
  try {
    const lurnies = await Lurny.find(); // Assume Lurny.find() is properly indexed and efficient
    const outputFilePath = "lurnies-updated.txt";
    // Operations array for bulkWrite
    const operations = lurnies.map((lurny) => {
      const collections = lurny.collections.filter(
        (collection) =>
          !collection.includes("Tools") && !collection.includes("Function")
      );
      fs.appendFileSync(outputFilePath, `${lurny.title}, ${lurny.url}\n`);
      return {
        updateOne: {
          filter: { _id: lurny._id },
          update: { collections },
        },
      };
    });

    // Perform the bulkWrite operation
    await Lurny.bulkWrite(operations);

    // Send response back to client
    res.status(200).send({ message: "Hashes cleared successfully" });
  } catch (error) {
    console.error("Error clearing hashes:", error);

    // Send error response back to client
    res.status(500).send({ error: "Failed to clear hashes" });
  }
});

router.delete("/delete-byuser", async (req, res) => {
  await Lurny.deleteMany({ user: "6627e122081fb43132b9dacb" });

  res.send("Success!!");
});

router.delete("/low-quality", async (req, res) => {
  const outputFile = "output.txt";
  try {
    const lurnies = await Lurny.find().populate("user");
    const stream = fs.createWriteStream(outputFile, { flags: "w" });

    for (let i = 0; i < lurnies.length; i++) {
      let lurny = lurnies[i];
      if (lurny.quiz.length < 5 || lurny.summary.length < 5) {
        await Lurny.findByIdAndDelete(lurny._id);

        stream.write(`${lurny.user.email} ${lurny.url}\n`);
      }
    }
    stream.end(() => {
      console.log("Finished writing to file");
    });

    res
      .status(200)
      .json({ message: "Low quality lurnies have been deleted and logged." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/update-collections", async (req, res) => {
  try {
    // Retrieve all Lurnies from the database
    const lurnies = await Lurny.find();

    for (const lurny of lurnies) {
      console.log(typeof lurny.collections[0]);
      if (typeof lurny.collections[0] === "string") {
        console.log(lurny._id);
        const newCollections = await processHashtags(lurny.collections);
        await Lurny.findByIdAndUpdate(lurny._id, {
          collections: newCollections,
        });
      }
    }

    // Once the updates are done, send a response back to the client
    res.status(200).json({ message: "All Lurnies updated successfully" });
  } catch (error) {
    console.error("error :>> ", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-link", async (req, res) => {
  try {
    const filePath = "urls.txt";
    const lurnies = await Lurny.find();
    console.log(lurnies.length);
    for (const lurny of lurnies) {
      if (lurny.url) {
        fs.appendFileSync(filePath, `${lurny.url}\n`, "utf-8");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
