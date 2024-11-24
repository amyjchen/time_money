"use client"
import * as React from 'react';

function getSalaryPerDay(salary: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(salary / 260)
}

function getSalaryPerMinute(salary: number, minutes: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(salary / 260 / minutes)
}

function getNumericSalaryPerSecond(salary: number, minutes: number) {
  return salary / 260 / minutes / 60;
}

function getTotalMinutesInRange(start: string, end: string) {
  const startSplit = start.split(':').map((x) => parseInt(x));
  const endSplit = end.split(':').map((x) => parseInt(x));
  const hours = endSplit[0] - startSplit[0];
  const minutes = endSplit[1] - startSplit[1];
  return hours * 60 + minutes;
}

interface CurrentIncomeProps {
  salary: number;
  minutes: number;
  startTime: string;
  endTime: string;
}

function CurrentIncome({ salary, minutes, startTime, endTime }: CurrentIncomeProps) {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  })

  const salaryPerSecond = getNumericSalaryPerSecond(salary, minutes);
  const minutesSinceStart = getTotalMinutesInRange(startTime, `${time.getHours()}:${time.getMinutes()}`)
  const secondsSinceStart = minutesSinceStart * 60 + time.getSeconds();

  const numbericCurrentIncome = Math.min(salaryPerSecond * secondsSinceStart, salary / 260)

  const currentIncome = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(numbericCurrentIncome)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const isWeekend = time.getDay() % 6 === 0;
  const pastEndTime = minutesSinceStart > getTotalMinutesInRange(startTime, endTime);
  return (
    <>
      <div className='flex flex-grow items-center justify-center space-between'>
        <div className='text-center'>
          <div className='text-8xl'>
            {isWeekend ? 'It\'s the weekend.' : currentIncome}
          </div>
          <p>{(isWeekend || pastEndTime) && 'You\'re not a charity, stop working.\n'}</p>
          <p>{time.toLocaleTimeString()} {tz}</p>
        </div>
      </div>
    </>
  )
}


export default function Home() {
  const [salary, setSalary] = React.useState(0);
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('17:00');

  const [collapsed, setCollapsed] = React.useState(false)

  const minutes = getTotalMinutesInRange(startTime, endTime)
  const dailySalary = getSalaryPerDay(salary)
  const minuteSalary = getSalaryPerMinute(salary, minutes);

  // TODO:
  // properly update start/end times if breaches min/max
  // currency in salaries
  // adjustable currency
  // optional end time, multiple start/end times, duration-based
  // store info & preferences in localstorage
  // change display of duration, show collective duration over pay period, over year
  // uuids
  // track # of unique visitors
  // ascending/descending value

  return (
    <main className='h-screen'>
      <div className="p-8 flex flex-col h-full">
        <button aria-label={collapsed ? 'expand' : 'collapse'} className='btn hover:opacity-100 transition-all w-full opacity-15' onClick={() => setCollapsed((prev) => !prev)}>
          {collapsed ? '↓' : '↑'}
        </button>
        {!collapsed && <div className='flex  flex-col gap-2'>
          <div className='flex gap-2'>
            <label >Start Time</label>
            <input className="text-black outline-gray-400 outline outline-1 rounded-sm" type="time" value={startTime} max={endTime} onChange={(e) => setStartTime(e.target.value)} />
            <label >End Time</label>
            <input className="text-black outline-gray-400 outline outline-1 rounded-sm" type="time" value={endTime} min={startTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <label>Salary/year</label>
              <input className="text-black outline-gray-400 outline outline-1 rounded-sm" value={salary.toString()} onChange={(e) => e.target.value === '' ? setSalary(0) : setSalary(parseFloat(e.target.value))} type="number" />
            </div>
            <p>Salary/day: {dailySalary}</p>
            <p>Salary/minute: {minuteSalary}</p>
          </div>
        </div>}
        <CurrentIncome salary={salary} minutes={minutes} startTime={startTime} endTime={endTime} />
      </div>

    </main >
  );
}
