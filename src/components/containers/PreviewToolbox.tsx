import { useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';
import FilterIcon from '../../icons/ui/FilterIcon';
import { useStoreActions, useStoreState } from '../../state/Hooks';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import DropdownContainer from './DropdownContainer';

export default function PreviewToolbox() {
  const toolbox = useStoreState((state) => state.previewToolbox);
  const updateToolbox = useStoreActions(
    (actions) => actions.updatePreviewToolBox,
  );
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState(toolbox.filter.pattern);

  const updateFilter = (
    key: 'type' | 'pattern',
    value: any,
    preview: boolean,
  ) => {
    updateToolbox({ filter: { ...toolbox.filter, [key]: value, preview } });
  };

  return (
    <DropdownContainer
      className="absolute p-2 z-50"
      space={-2}
      dontCollapse
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <div className="bg-white rounded py-2 px-3 flex flex-row hover:bg-circle-gray-300">
        <FilterIcon className="w-6" />
        <ExpandIcon expanded={expanded} className="w-4 ml-2" />
      </div>
      <div className="ml-2 bg-white w-64 rounded">
        <div className="p-4">
          <h4 className="text-sm font-medium">Filter Target</h4>
          <Select
            value={toolbox.filter.type}
            className="my-1 w-full"
            onChange={(value: 'branches' | 'tags') =>
              updateFilter('type', value, toolbox.filter.preview)
            }
          >
            <option value="branches">Branch</option>
            <option value="tags">Tag</option>
          </Select>
          <h4 className="text-sm font-medium">Value</h4>
          <input
            className="bg-white rounded p-2 px-4 w-full mt-1 shadow-sm border border-circle-gray-300"
            placeholder="^.*$"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </div>
        <div className="border-t border-circle-gray-300 py-4 px-1 flex">
          <Button
            className="ml-auto"
            variant="flat"
            type="button"
            onClick={() => {
              setFilter('');
              updateFilter('pattern', filter, false);
            }}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => {
              updateFilter('pattern', filter, true);
            }}
          >
            Preview
          </Button>
        </div>
      </div>
    </DropdownContainer>
  );
}
