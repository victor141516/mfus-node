import { useState } from 'react'

export default function Input({
  name,
  label,
  prefix,
  value: propValue,
  autofocus,
  onChange,
}: {
  name: string
  label: string
  prefix?: string
  value: string
  autofocus?: boolean
  onChange: (value: string) => void
}) {
  const [value, setValue] = useState(propValue)
  if (propValue && propValue !== value) setValue(propValue)
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-medium text-gray-700 dark:text-gray-100">
        <>{label}</>
      </label>
      <div className="mt-2 relative rounded-md shadow-sm">
        {prefix ? (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-slate-300 text-3xl">
              <>{prefix}</>
            </span>
          </div>
        ) : null}
        <input
          id={name}
          key={name}
          type="text"
          className={`${
            prefix ? 'pl-29' : ''
          } focus:ring-primary-500 focus:border-primary-500 block h-18 w-full text-3xl border-gray-300 dark:bg-slate-500 dark:border-slate-700 dark:text-gray-100 rounded-md`}
          name={name}
          value={value}
          autoFocus={autofocus}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
