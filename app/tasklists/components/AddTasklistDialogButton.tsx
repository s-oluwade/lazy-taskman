import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {PlusCircledIcon} from '@radix-ui/react-icons';
import {faker} from '@faker-js/faker';
import {useState} from 'react';
import {CreateTasklistDocument, GetTasklistsDocument} from '@/graphql/generated';
import {GetAllTasklistsDocument} from '@/graphql/generated';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
// import {useMutation, useQuery} from '@urql/next';
import {useMutation} from '@apollo/client';

export function AddTasklistDialogButton() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isError, setIsError] = useState(false);
  // just a dummy placeholder
  const [user, setUser] = useState<{userId: number} | null>(null);
  const [createTasklist, {data, loading, error}] = useMutation(CreateTasklistDocument, {
    refetchQueries: [GetTasklistsDocument],
  });
  // const [result, createTasklist] = useMutation(CreateTasklistDocument);

  function onSubmit(e: React.FormEvent<HTMLButtonElement>) {
    if (name.length === 0) {
      setIsError(true);
      e.preventDefault();
      return;
    }

    createTasklist({variables: {tasklist: {name, description, userId: user?.userId}}});
  }

  return (
    <Dialog
      onOpenChange={(opened) => {
        if (!opened) {
          setName('');
          setDescription('');
          setIsError(false);
        }
      }}>
      <DialogTrigger>
        <div
          onClick={() => {
            const adjective = faker.word.adjective();
            const interjection = faker.word.interjection();
            const phrase = adjective + '-' + interjection;
            setName(phrase);
          }}
          title='Add New Tasklist'
          className='p-8 border-2 rounded-xl h-full justify-center flex items-center hover:text-muted-foreground cursor-pointer'>
          <PlusCircledIcon className='h-36 w-36' />
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New Tasklist</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <div className='col-span-3'>
              <Input id='name' defaultValue={name} onChange={(e) => setName(e.target.value)} />
              {isError && <p className='text-red-500 text-sm'>A name is required.</p>}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Description
            </Label>
            <Textarea
              id='description'
              defaultValue={description}
              className='col-span-3'
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSubmit} type='submit'>
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
