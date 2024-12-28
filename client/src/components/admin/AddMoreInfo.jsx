/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";

export default function AddMoreInfo({ close, value, onchange, submit }) {
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded p-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add Field</h1>
          <button onClick={close} className="w-fit block ml-auto animate-pulse">
            <IoClose size={24} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="field" className="block text-neutral-700">
            Field Name
          </label>
          <input
            type="text"
            id="field"
            name="more_info"
            value={value}
            onChange={onchange}
            className="w-full border border-neutral-300 rounded p-2"
            placeholder="Field Name"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={submit}
            className="w-full bg-green-500 text-white rounded p-2 hover:bg-green-700"
          >
            Add Field
          </button>
        </div>
      </div>
    </section>
  );
}
