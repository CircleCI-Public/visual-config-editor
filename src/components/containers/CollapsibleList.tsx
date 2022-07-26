import { ReactElement, useState } from 'react';
import ExpandIcon from '../../icons/ui/ExpandIcon';

export interface CollapsibleListProps {
  title: string;
  titleExpanded?: ReactElement;
  children: ReactElement;
  expanded?: boolean;
  classNameExpanded?: string;
  className?: string;
  onChange?: (expanded: boolean) => void;
}

const CollapsibleList = (props: CollapsibleListProps) => {
  const [expanded, setExpanded] = useState(props.expanded || false);

  return (
    <div
      className={`transition-all ${
        props.classNameExpanded && expanded
          ? props.classNameExpanded
          : props.className
      }`}
    >
      <div className="flex flex-row">
        <button
          onClick={(e) => {
            const newExpanded = !expanded;

            setExpanded(newExpanded);
            props.onChange && props.onChange(newExpanded);
          }}
          type="button"
          className="flex hover:bg-circle-gray-300  border-white border px-2 rounded"
        >
          <ExpandIcon className="w-3 h-5 mx-auto" expanded={expanded} />
        </button>
        <p className="mx-2 font-bold leading-6 tracking-wide">{props.title}</p>
        {expanded && props.titleExpanded}
      </div>
      {expanded && <div className="ml-4">{props.children}</div>}
    </div>
  );
};

export default CollapsibleList;
