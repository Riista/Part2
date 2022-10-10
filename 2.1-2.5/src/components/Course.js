const Header = ({course}) => <div><h1>{course}</h1></div>

const Total = ({part}) => <h3> {"total of "} {part.parts.reduce((sum, item) => sum += item.exercises, 0)} {"exercises"}</h3>

const Part = ({part}) => <p> {part.name} {part.exercises}</p>

const Content = ({course}) =>
course.map((part) => 
(
  
  <div key={part.id}>
    <h2>{part.name}</h2>
    {part.parts.map((part) => (
   <Part key={part.id} part={part}/>
   ))}
  <Total part={part}/>
   
    </div>
))
 const Course = ({course}) => 
 
    (
    <>
   <Header course={"Web development curriculum"} />
   <Content course={course}  />
   
    </>
    )
    
    export default Course