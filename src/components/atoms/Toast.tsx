import { useStoreState, useStoreActions } from '../../state/Hooks';

const Toast = () => {
  const toast = useStoreState((state) => state.toast);
  const setToast = useStoreActions((actions) => actions.setToast);

  return (
    <>
      {toast && (
        <button
          className={
            'flex flex-row text-white bg-circle-gray-700 p-3 w-full transition-opacity rounded'
          }
          aria-label={toast?.label}
          onClick={() => {
            setToast();
          }}
        >
          <p className="font-bold mx-2 overflow-ellipsis overflow-x-hidden whitespace-nowrap my-auto">
            {toast?.label}
          </p>
          <p className="my-auto">{toast?.content}</p>
        </button>
      )}
    </>
  );
};

export default Toast;
