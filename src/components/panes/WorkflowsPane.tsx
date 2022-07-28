import Logo from '../../icons/ui/Logo';
import { useStoreState } from '../../state/Hooks';
import WorkflowPane from '../containers/WorkflowContainer';

const WorkflowsPane = () => {
  const workflows = useStoreState((state) => state.definitions.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);

  return (
    <div
      arial-label="Workflows Pane"
      className="flex flex-col flex-nowrap flex-1"
    >
      <header className="flex w-full bg-white h-16">
        <div className="p-2 flex flex-row my-auto">
          <Logo className="mx-2" />
          <h1 className="text-xl font-bold">Visual Config Editor</h1>
        </div>
      </header>

      <WorkflowPane
        workflow={workflows[selectedWorkflow].value}
        bgClassName="bg-circle-gray-200"
        className="border border-r-0 h-full border-b-0 border-circle-gray-300"
      />
    </div>
  );
};

export default WorkflowsPane;
