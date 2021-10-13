import { AbstractExecutor } from "@circleci/circleci-config-sdk/dist/lib/Components/Executor/Executor";

const ExecutorSummary: React.FunctionComponent<{ data: AbstractExecutor}> = (props) => {
  return (
    <div>
      {props.data.name} {props.data.resourceClass}
    </div>
  )
}

export default ExecutorSummary;