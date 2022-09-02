const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const PORT = 3000

const app = express()
app.use(express.json())

// Student Registration portal for admissions

const studentSchema = mongoose.Schema({
  username: String,
  email: String,
  phoneno: Number,
  branch: String,
  marks: Number,
})

const Student = mongoose.model("Student", studentSchema)

// Adding Student
app.post("/registration", (req, res) => {
  const {username, email, phoneno, branch, marks} = req.body

  try {
    let student = Student({
      username: username,
      email: email,
      phoneno: phoneno,
      branch: branch,
      marks: marks,
    })

    student.save()
    res.send({msg: "registration successful", data: student})
  } catch (error) {
    res.status(500).send({err: err})
  }
})

// Getting all students
app.get("/students", async (req, res) => {
  let student = await Student.find()
  res.send(student)
})

// Getting all students according to branches
app.get("/students/:branch", async (req, res) => {
  const branch = req.params.branch
  let student = await Student.find({branch: branch})
  if (student.length === 0) {
    res.status(404).send({error: "student doesn't exist"})
    return
  }
  res.send(student)
})

// Editing the detial of student
app.put("/student/:email", async (req, res) => {
  const email = req.params.email
  const {username, phoneno, branch, marks} = req.body

  await Student.updateMany(
    {email: email},
    {
      username: username,
      phoneno: phoneno,
      branch: branch,
      marks: marks,
    }
  )
  res.send({msg: "Details of the student has been updated"})
})

// Deleting the Student
app.delete("/students/:email", async (req, res) => {
  const email = req.params.email

  await Student.deleteOne({email: email})

  res.send({msg: "student deleted"})
})

mongoose.connect(process.env.MONGO_URL, () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
