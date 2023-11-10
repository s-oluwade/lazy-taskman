'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AddSubtaskDocument, GetTasksDocument } from '@/graphql/generated';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface AddSubtaskButtonProps {
  taskId: number;
}

const AddSubtaskButton = ({taskId}: AddSubtaskButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [addSubtask, {data, loading, error}] = useMutation(AddSubtaskDocument, {
    refetchQueries: [GetTasksDocument],
  });

  async function onSubmit() {
    if (!taskId || title === '') {
      return;
    }

    addSubtask({
      variables: {
        input: {
          title,
          taskId,
        },
      },
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'}>+</Button>
      </SheetTrigger>
      <SheetContent className='h-52' side={'bottom'}>
        <SheetHeader>
          <SheetTitle className='text-2xl mb-6 font-thin'>Add Subtask</SheetTitle>
        </SheetHeader>
        <div className='flex items-center gap-4 justify-center'>
          <div className='flex w-5/6 gap-4'>
            <div className='flex flex-1 items-center gap-2'>
              <Label htmlFor='title' className='text-right font-light'>
                Title
              </Label>
              <Input
                id='title'
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <SheetClose asChild>
            <Button onClick={onSubmit} type='submit'>
              {/* <PaperPlaneIcon className='h-9 w-9 text-muted-foreground' /> */}
              Add
            </Button>
            {/* <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button> */}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddSubtaskButton;