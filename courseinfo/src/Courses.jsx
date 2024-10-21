import React from 'react'
import './App.jsx'

const Header = ({ course }) => <h2>{course.name}</h2>

const Total = ({ parts }) => parts.reduce(function(sum, part) {
  //console.log(sum, part.exercises)
  return sum + part.exercises
}, 0)

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map((part, i) => (
      <Part
        key={i} part={part}
      />
    ))}
  </>

const Courses = ({ courses }) =>
  <>
    <h1>Web development curriculum</h1>
    {courses.map((course, i) => (
      <div key={i}>
        <Header
          course={course}
        />
        <Content
          parts={course.parts}
        />
        <b>Total of <Total parts={course.parts}/> exercises</b>
      </div>
    ))}
  </>

export default Courses
