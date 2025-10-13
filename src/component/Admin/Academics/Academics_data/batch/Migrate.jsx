import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '../../../../src/components/ui/dialog';
import { Button } from '../../../../src/components/ui/button';
import { Label } from '../../../../src/components/ui/label';
import { Input } from '../../../../src/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../../../src/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod Schema
const migrateSchema = z.object({
  course: z.string().min(1, "Course is required"),
  batch: z.string().min(1, "Batch is required"),
  fee: z.coerce.number().min(1, "Fee must be a positive number"),
});

const Migrate = () => {
  const [openmigrate, setOpenmigrate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(migrateSchema),
    defaultValues: {
      course: '',
      batch: '',
      fee: '',
    },
  });

  const onSubmit = (data) => {
    console.log("Migrate Data:", data);
    setOpenmigrate(false);
    reset();
  };

  return (
    <div>
      <Button
        onClick={() => setOpenmigrate(true)}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-8 flex items-center rounded-md hover:bg-blue-600 transition-all whitespace-nowrap"
      >
        Migrate
      </Button>

      <Dialog open={openmigrate} onOpenChange={setOpenmigrate}>
        <DialogContent
          className="sm:max-w-2xl w-full rounded-2xl p-6 shadow-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Migrate Batch</DialogTitle>
            <DialogDescription className="text-md mt-1">
              Add the batch information below and save.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-6">
            {/* Select Course */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium">Select Course:</Label>
              <Controller
                control={control}
                name="course"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BCA">BCA</SelectItem>
                      <SelectItem value="BCOM">BCOM</SelectItem>
                      <SelectItem value="BSC">BSC</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course && (
                <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.course.message}</p>
              )}
            </div>

            {/* Select Batch */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium">Select Batch:</Label>
              <Controller
                control={control}
                name="batch"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.batch && (
                <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.batch.message}</p>
              )}
            </div>

            {/* Fee Input */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium">Batch Fee:</Label>
              <Controller
                control={control}
                name="fee"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter batch fee"
                    className="col-span-3"
                  />
                )}
              />
              {errors.fee && (
                <p className="text-red-500 text-xs col-start-2 col-span-3">{errors.fee.message}</p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-4 rounded-md text-sm">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Migrate;
