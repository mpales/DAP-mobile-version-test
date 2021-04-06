import {Thread} from 'react-native-threads';

//import {createWorkerpool} from './middleware/worker-pool';
// this is implementation for worker-pool, after further testing
// it crash the app if using different switcher within redux enchancer callback
// createWorkerpool({workers: 2}).createSwitcher();
// we can't balance the memory load of function using multiple initiliaziation RNHost.
// instead will be using multiple applyWorker() fn
// redux is high-order function because of that,
// multiple enhancher would make aggregate to concurrent memory usage.

interface Task<data, result> {
  map<result2>(f: (o: result) => result2): Task<data, result2>;
  then<result2>(f: Task<result, result2>): Task<data, result2>;
}

interface WorkerPool {
  createSwitch(): void;
}

interface WorkerPoolOptions {
  workers: number;
}

export const createWorkerpool = (options: WorkerPoolOptions): WorkerPool => {
  const workers = new Map(
    Array.from({length: options.workers}).map<[number, Worker]>(
      (num, index) => {
        const w = new Thread('../rnWorker.js');
        w.id.pool = index;
        return [index,w];
      },
    ),
  );
  const idle = Array.from(workers.keys());
  const resolvers = new Map<number, Function>();
  //const backlog: {id: number; task: (data: any) => void; data: any}[] = [];
  let taskIdCounter = 0;
  let terminating = false;

  return {
    createSwitch: () => {
      if (terminating) {
        return;
      }
      if (idle.length == 0) {
        return;
      }
      const worker = idle.shift();
      //const tasks = backlog.shift()
      //const {id} = tasks;
      console.log(worker);
      idle.push(worker);
      //console.log(`scheduling ${task.id} on ${worker}`);
      //const msg = {...task, task: task.task.toString()};
      return workers.get(worker);
    },
  };
};
