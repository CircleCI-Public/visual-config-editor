import { parsers } from '@circleci/circleci-config-sdk';
import { OrbImport } from '@circleci/circleci-config-sdk/dist/src/lib/Orb';
import { Form, Formik } from 'formik';
import { useRef } from 'react';
import { parse } from 'yaml';
import WorkflowIcon from '../../../icons/components/WorkflowIcon';
import { dataMappings } from '../../../mappings/GenerableMapping';
import InspectableMapping from '../../../mappings/InspectableMapping';
import { useStoreActions, useStoreState } from '../../../state/Hooks';
import { NavigationComponent } from '../../../state/Store';
import { Button } from '../../atoms/Button';
import { Footer } from '../../atoms/Footer';
import InspectorProperty from '../../atoms/form/InspectorProperty';
import { WorkflowSelector } from '../../atoms/WorkflowSelector';
import DefinitionsContainer from '../../containers/DefinitionsContainer';
import OrbImportsContainer from '../../containers/OrbImportsContainer';
import TabbedMenu from '../TabbedMenu';
import { loadOrb, OrbImportWithMeta } from './OrbDefinitionsMenu';

/**
 * The main menu for inspecting the app's contents.
 */
const DefinitionsMenu = (props: { expanded: boolean[] }) => {
  const workflowGraphs = useStoreState((state) => state.definitions.workflows);
  const selectedWorkflow = useStoreState((state) => state.selectedWorkflow);
  const config = useStoreState((state) => state.config);
  const updateConfig = useStoreActions((actions) => actions.generateConfig);
  const persistProps = useStoreActions((actions) => actions.persistProps);
  const workflow = workflowGraphs[selectedWorkflow].value;

  return (
    <div className="h-full bg-white flex flex-col">
      <header className="ml-4 mb-4 flex">
        <WorkflowIcon className="w-8 h-8 p-1 mr-1" />
        <h1 className="text-2xl font-bold">{workflow.name}</h1>
        <WorkflowSelector />
      </header>
      <TabbedMenu tabs={['DEFINITIONS', 'PROPERTIES']}>
        <div
          className="px-2 flex-1 w-full flex-col overflow-y-scroll"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <OrbImportsContainer />
          {dataMappings.map((mapping, index) => {
            const dataType = mapping.mapping as InspectableMapping;

            return (
              <DefinitionsContainer
                type={dataType}
                expanded={props.expanded[index]}
                onChange={(isExpanded) => {
                  persistProps({
                    ...props,
                    expanded: props.expanded.map((expanded, i) =>
                      i === index ? isExpanded : expanded,
                    ),
                  });
                }}
                key={dataType.name.plural}
              />
            );
          })}
        </div>
        <div className="p-6">
          <Formik
            initialValues={{ name: workflow.name }}
            enableReinitialize
            onSubmit={(values) => {}}
          >
            {(_) => (
              <Form className="flex flex-col flex-1">
                <InspectorProperty label="Name" name="name" />
              </Form>
            )}
          </Formik>
        </div>
      </TabbedMenu>
      <span className="border-b border-circle-gray-300" />
      <Footer>
        {config && (
          <Button
            variant="primary"
            className=" w-min whitespace-nowrap"
            onClick={(e) => updateConfig()}
          >
            Generate Config
          </Button>
        )}
      </Footer>
    </div>
  );
};

const DefinitionsMenuNav: NavigationComponent = {
  Component: DefinitionsMenu,
  Label: (props: { expanded: boolean[] }) => <p>Definitions</p>,
};

export default DefinitionsMenuNav;
