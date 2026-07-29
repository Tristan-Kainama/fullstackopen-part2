const Header = (props) => <h1>{props.course}</h1>

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>Number of exercises {props.total}</p>

const Course = (props) => {
    const total = props.course.parts.reduce((acc, curr) => acc + curr.exercises, 0)
    console.log(total)

    return(
    <div>
        <Header course={props.course.name}/>
        <Content parts={props.course.parts}/>
        <Total total={total}/>
    </div>
    )
}

export default Course