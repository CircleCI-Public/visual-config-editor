import Editor, { DiffEditor } from '@monaco-editor/react';
import { useStoreState } from '../../state/Hooks';
import { version } from '../../version.json';

const EditorPane = () => {
  const config = useStoreState((state) => state.config);
  const editingConfig = useStoreState((state) => state.editingConfig);

  const configYAML = (yml: string) => {
    const matchSDKComment = yml?.match('# SDK Version: .*\n');

    if (yml && matchSDKComment && matchSDKComment.index) {
      const comment = `# VCE Version: ${version}\n# Modeled with the CircleCI visual config editor.\n# For more information, see https://github.com/CircleCI-Public/visual-config-editor\n`;
      const endOfSDKComment = matchSDKComment.index + matchSDKComment[0].length;

      return (
        yml.substring(0, endOfSDKComment) +
        comment +
        yml.substring(endOfSDKComment, yml.length)
      );
    }

    return yml;
  };

  return (
    <div
      aria-label="Editor Pane"
      className="bg-circle-gray-900 h-2/5 w-full flex flex-col"
    >
      <div className="border-b text-xl border-circle-gray-800 font-bold flex flex-row">
        <div className="ml-4 border-b-4 px-3 py-3 w-max text-sm tracking-wide font-bold text-white border-white">
          CONFIG
        </div>
        <div className="p-2 ml-auto">
          {/* <DropdownContainer className="rounded-md bg-circle-gray-300 text-circle-black px-2 hover:bg-circle-gray-400">
            <p>•••</p>
            <div className="bg-white flex-col flex rounded shadow text-base">
              <button
                className="border-b border-circle-gray-300 pl-3 pr-8 text-left hover:bg-circle-gray-300"
                onClick={(e) => {
                  inputFile.current?.click();
                  e.stopPropagation();
                }}
              >
                Open
              </button>
              <button className="border-b border-circle-gray-300 pl-3 pr-8 text-left hover:bg-circle-gray-300">
                Save
              </button>
            </div>
          </DropdownContainer> */}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {editingConfig ? (
          <DiffEditor
            theme="vs-dark"
            language="yaml"
            original={config && configYAML(config)}
            modified={editingConfig && configYAML(editingConfig)}
          />
        ) : (
          <Editor
            theme="vs-dark"
            wrapperProps={{ className: 'flex-1 flex-grow' }}
            language="yaml"
            value={config && configYAML(config)}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPane;
