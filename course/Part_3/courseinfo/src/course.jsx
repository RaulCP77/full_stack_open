const Course = (props) => {
    const { course } = props

    const Header = (props) => <h1>{props.course}</h1>

    const Content = ({ parts }) => (
        parts.map((part) => (
            <Part name={part.name} exercises={part.exercises} key={part.id} />
        ))
    )

    const Part = (props) => {
        return (
            <div>
                <p key={props.id}>
                    {props.name} {props.exercises}
                </p>
            </div>
        )
    }

    const Total = (props) => <p>Total of {props.total} exercises</p>

    return (
        <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total
          total={
            course.parts.reduce((sum, part) => sum + part.exercises, 0)}
        />
      </div>
      )
  }

  export default Course