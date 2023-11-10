'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select-for-priority';
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';
import {options} from '../data/options';
import {CreateTaskDueDatePicker} from './CreateTaskDueDatePicker';
import {CreateTaskDocument, GetTasksDocument} from '@/graphql/generated';
import {useMutation} from '@apollo/client';

interface CreateTaskButtonProps {
  tasklistName: string;
}

const CreateTaskButton = ({tasklistName}: CreateTaskButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [createTask, {data, loading, error}] = useMutation(CreateTaskDocument, {
    refetchQueries: [GetTasksDocument],
  });

  async function onSubmit() {
    if (title === '' || label === '' || priority === '') {
      console.log('missing fields');
      return;
    }

    createTask({
      variables: {
        task: {
          tasklistName,
          title,
          label,
          priority,
          dueDate,
        },
      },
    });

    // startTransition(() => {
    //   // Refresh the current route and fetch new data from the server without
    //   // losing client-side browser or React state.
    //   router.refresh();
    // });
  }

  function changeDueDate(date: Date | undefined) {
    setDueDate(date?.toLocaleDateString() ?? null);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='whitespace-nowrap' variant='outline'>
          Create New Task
        </Button>
      </SheetTrigger>
      <SheetContent className='h-52' side={'bottom'}>
        <SheetHeader>
          <SheetTitle className='text-2xl mb-6 font-thin'>New Task</SheetTitle>
          {/* <SheetDescription>
            </SheetDescription> */}
        </SheetHeader>
        <div className='flex justify-center'>
          <div className='flex items-center gap-4 justify-center flex-col xl:flex-row'>
            <div className='flex flex-1 items-center gap-2 w-full'>
              <Label htmlFor='title' className='text-right font-light'>
                Title
              </Label>
              <Input
                id='title'
                className='min-w-[300px]'
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className='flex flex-wrap gap-4 justify-center'>
              <div>
                <Select onValueChange={setLabel}>
                  <SelectTrigger className='w-[160px]'>
                    <SelectValue placeholder='Label' />
                  </SelectTrigger>
                  <SelectContent>
                    {options.labels.map((label) => (
                      <SelectItem key={label.value} value={label.value}>
                        {label.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select onValueChange={setPriority}>
                  <SelectTrigger className='w-[130px]'>
                    <SelectValue placeholder='Priority' />
                  </SelectTrigger>
                  <SelectContent>
                    {options.priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <CreateTaskDueDatePicker onChange={changeDueDate} />
              </div>
              <SheetClose asChild>
                <Button onClick={onSubmit} type='submit'>
                  Create
                </Button>
                {/* <Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button> */}
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateTaskButton;