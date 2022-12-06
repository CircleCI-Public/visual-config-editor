import { parseJob } from '@circleci/circleci-config-parser';
import { Job, orb, reusable, workflow } from '@circleci/circleci-config-sdk';
import JobSummary from '../../core/components/atoms/summaries/JobSummary';
import JobInspector from '../../core/components/containers/inspector/JobInspector';
import { componentParametersSubtypes } from '../../core/components/containers/inspector/subtypes/ParameterSubtypes';
import JobIcon from '../../core/icons/components/JobIcon';
import {
  DefinitionAction,
  definitionsAsArray,
} from '../../core/state/DefinitionStore';
import JobNode from '../../flow/components/JobNode';
import InspectableMapping from '../InspectableMapping';
import { NodeMapping } from '../NodeMapping';
import { UNDEFINED_EXECUTOR } from './ExecutorMapping';

export const JobMapping: InspectableMapping<Job> & NodeMapping<Job, workflow.WorkflowJob> = {
  key: 'jobs',
  name: {
    singular: 'Job',
    plural: 'Jobs',
  },
  defaults: {
    name: 'New Job',
    steps: [],
    executor: { name: 'Select Executor' },
  },
  parameters: componentParametersSubtypes.job,
  subscriptions: {
    commands: (prev, cur: reusable.ReusableCommand, j) => {
      let steps;

      if (cur) {
        steps = j.steps.map((step) =>
          step instanceof reusable.ReusedCommand && step.name === prev.name
            ? new reusable.ReusedCommand(cur, step.parameters)
            : step,
        );
      } else {
        steps = j.steps.filter((step) =>
          step instanceof reusable.ReusedCommand
            ? step.name !== prev.name
            : true,
        );
      }

      return new reusable.ParameterizedJob(
        j.name,
        j.executor,
        j instanceof reusable.ParameterizedJob ? j.parameters : undefined,
        steps,
      );
    },
    executors: (_, cur, j) => {
      return new reusable.ParameterizedJob(
        j.name,
        cur?.reuse() || UNDEFINED_EXECUTOR,
        j instanceof reusable.ParameterizedJob ? j.parameters : undefined,
        j.steps,
      );
    },
  },
  resolveObservables: (job) => {
    const reusedExecutor =
      job.executor instanceof reusable.ReusedExecutor
        ? job.executor.executor
        : undefined;
    const orbExec =
      reusedExecutor instanceof orb.OrbRef ? reusedExecutor : undefined;

    const orbCommands = job.steps.filter(
      (command) =>
        command instanceof reusable.ReusableCommand &&
        command.name.includes('/'),
    );

    return {
      executors: orbExec ? undefined : reusedExecutor,
      commands: job.steps.filter(
        (command) =>
          command instanceof reusable.ReusableCommand &&
          !command.name.includes('/'),
      ),
      orbs: orbExec ? [orbExec, ...orbCommands] : orbCommands,
    };
  },
  /**
   TODO: Implement this to pass transform method to
   dependsOn: (definitions) => [definitions.commands, definitions.executors],
   */
  transform: ({ name, ...values }, definitions) => {
    return parseJob(
      name,
      values,
      definitionsAsArray(definitions.commands),
      definitionsAsArray(definitions.executors),
      definitionsAsArray(definitions.orbs),
    );
  },
  store: {
    add: (actions) => actions.define_jobs,
    update: (actions) => actions.update_jobs,
    remove: (actions) => actions.delete_jobs,
  },
  dragTarget: 'workflow',
  node: {
    getId: (data) => {
      return data.parameters?.name || data.name;
    },
    transform: (data, nodes, params) => {
      const stagedNames = new Set(
        nodes
          ?.filter((element) => element.type === 'workflow_job')
          .map((node) => node.data.parameters?.name || node.data.name),
      );
      let name = data.name;

      if (stagedNames.has(name)) {
        for (let i = 2; true; i++) {
          const newName = `${name} (${i})`;

          if (!stagedNames.has(newName)) {
            name = newName;
            break;
          }
        }
      }

      const newParams = params || {};

      if (name !== data.name) {
        newParams.name = name;
      }

      return new workflow.WorkflowJob(data, newParams);
    },
    component: JobNode,
    key: 'workflow_job'
  },
  components: {
    icon: JobIcon,
    summary: JobSummary,
    inspector: JobInspector,
  },
  docsInfo: {
    description:
      'A %s is a configured collection of steps to be executed within the Executor environment.',
    link: 'https://circleci.com/docs/concepts/#jobs',
  },
  requirements: [
    {
      message:
        'You must define or import at least one executor before creating a job.',
      test: (store) => {
        const hasExecs = Object.values(store.executors).length > 0;
        const orbWithExecs = Object.values(store.orbs).some(
          (orb) => Object.values(orb.value.executors).length > 0,
        );

        return hasExecs || orbWithExecs;
      },
    },
  ],
};

export type JobAction = DefinitionAction<Job>;

export type JobActions = {
  define_jobs: JobAction;
  update_jobs: JobAction;
  delete_jobs: JobAction;
  cleanup_jobs: JobAction;
};
