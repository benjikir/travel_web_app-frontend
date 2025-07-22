import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import * as z from 'zod'; // For schema definition
import { Plus, Edit, Trash, ChevronLeft, ChevronRight, MapPin, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon from lucide-react



const locationSchema = z.object({
  id: z.string().optional(), // ID is optional when creating, required when updating
  loc_name: z.string()
    .min(1, { message: "Location name is required." })
    .max(255, { message: "Location name must be 255 characters or less." }),
  user_id: z.coerce.number() // Use coerce to safely parse string to number from input type="number"
    .int("User ID must be an integer.")
    .positive("User ID must be a positive number."),
  country_id: z.coerce.number() // Use coerce
    .int("Country ID must be an integer.")
    .positive("Country ID must be a positive number."),
  image_url: z.string()
    .url({ message: "Invalid URL format." })
    .max(2048, { message: "Image URL must be 2048 characters or less." })
    .optional() // This makes the field optional
    .or(z.literal('')), // Allow empty string if user leaves it blank
  latitude: z.coerce.number() // Use coerce
    .min(-90, { message: "Latitude must be between -90 and 90." })
    .max(90, { message: "Latitude must be between -90 and 90." }),
  longitude: z.coerce.number() // Use coerce
    .min(-180, { message: "Longitude must be between -180 and 180." })
    .max(180, { message: "Longitude must be between -180 and 180." }),
  // 'description' is common for UI, assuming it can be added even if not strictly in backend schema
  description: z.string()
    .max(200, { message: "Description must be 200 characters or less." })
    .optional()
    .nullable(), // Allows null for optional description
});

// --- LOCATIONS COMPONENT ---
function Locations() {
  const [locations, setLocations] = useState([
    { id: '1', loc_name: 'Eiffel Tower', user_id: 1, country_id: 33, image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Tour_Eiffel_%28cropped%29.jpg', latitude: 48.8584, longitude: 2.2945, description: 'A famous landmark in Paris, France.' },
    { id: '2', loc_name: 'Brandenburg Gate', user_id: 1, country_id: 49, image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Brandenburg_Gate%2C_Berlin_-_Germany.jpg', latitude: 52.5163, longitude: 13.3777, description: 'Historic monument in Berlin, Germany.' },
    { id: '3', loc_name: 'Colosseum', user_id: 2, country_id: 39, image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo.jpg', latitude: 41.8902, longitude: 12.4922, description: 'Ancient amphitheater in Rome, Italy.' },
    { id: '4', loc_name: 'Statue of Liberty', user_id: 3, country_id: 123, image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/800px-Statue_of_Liberty_7.jpg', latitude: 40.6892, longitude: -74.0445, description: 'Iconic symbol of freedom in New York, USA.' },
  ]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null); // null for new, Location object for editing

  // Hook Form Initialization
  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      id: '',
      loc_name: '',
      user_id: 0,
      country_id: 0,
      image_url: '',
      latitude: 0.0,
      longitude: 0.0,
      description: '',
    },
  });

  // --- HANDLERS FOR CAROUSEL NAVIGATION ---
  const goToNextLocation = () => {
    if (locations.length <= 1) return;
    setCurrentLocationIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const goToPreviousLocation = () => {
    if (locations.length <= 1) return;
    setCurrentLocationIndex((prevIndex) => (prevIndex - 1 + locations.length) % locations.length);
  };

  // --- HANDLERS FOR OPENING / CLOSING FORM ---
  const openCreateDialog = () => {
    setEditingLocation(null);
    // Reset form fields to empty/default for new creation
    form.reset({ id: '', loc_name: '', user_id: 0, country_id: 0, image_url: '', latitude: 0.0, longitude: 0.0, description: '' });
    setIsFormOpen(true);
  };

  const openEditDialog = (location) => {
    setEditingLocation(location);
    // Pre-fill form with data of the location being edited
    form.reset(location);
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
    form.reset(); // Reset form after closing regardless of action
  };

  // --- HANDLER FOR FORM SUBMISSION (CREATE / UPDATE) ---
  const onSubmit = (data) => {
    if (editingLocation) {
      // Update existing location
      setLocations(locations.map((loc) => (loc.id === data.id ? { ...data, id: loc.id } : loc)));
    } else {
      // Create new location
      const newLocation = { ...data, id: crypto.randomUUID() }; // Generate unique ID
      setLocations([...locations, newLocation]);
      // If adding, navigate to the newly added location (optional)
      setCurrentLocationIndex(locations.length);
    }
    closeFormDialog();
  };

  // --- HANDLER FOR DELETION ---
  const handleDelete = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      const updatedLocations = locations.filter(loc => loc.id !== idToDelete);
      setLocations(updatedLocations);

      // Adjust index to prevent showing a non-existent location
      if (updatedLocations.length === 0) {
        setCurrentLocationIndex(0); // No locations left
      } else if (currentLocationIndex >= updatedLocations.length) {
        // If the deleted item was the last one, go to the new last item
        setCurrentLocationIndex(updatedLocations.length - 1);
      }
      // Otherwise, the index stays the same (if an item before the current one was deleted)
    }
  };

  const currentLocation = locations.length > 0 ? locations[currentLocationIndex] : null;

  return (
    <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-inner flex flex-col items-center justify-center relative min-h-[300px]">
      <h3 className="text-xl font-semibold mb-4 text-center">Your Locations</h3>

      {locations.length > 0 ? (
        <AnimatePresence mode="wait">
          {/* Use motion.div for carousel item animation */}
          <motion.div
            key={currentLocation?.id || 'empty'} // Key is crucial for Framer Motion to animate changes
            initial={{ opacity: 0, x: 100 }} // Start state: invisible, moved right
            animate={{ opacity: 1, x: 0 }}   // End state: visible, at original position
            exit={{ opacity: 0, x: -100 }}   // Exit state: invisible, moved left
            transition={{ duration: 0.3 }}   // Animation duration
            className="w-full max-w-md"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{currentLocation.loc_name}</CardTitle>
                {currentLocation.image_url && (
                    <img
                        src={currentLocation.image_url}
                        alt={`Image for ${currentLocation.loc_name}`}
                        className="w-full h-48 object-cover rounded-md mt-2"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x200?text=Image+Not+Found"; }} // Fallback for broken images
                    />
                )}
                <CardDescription>
                    {/* Display Location coordinates */}
                    <span className="flex items-center gap-1 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        Lat: {currentLocation.latitude.toFixed(4)}, Lng: {currentLocation.longitude.toFixed(4)}
                    </span>
                    {/* Display User and Country IDs */}
                    <span className="block mt-1 text-xs text-gray-600">
                        User ID: {currentLocation.user_id} | Country ID: {currentLocation.country_id}
                    </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display Description */}
                <p className="text-sm text-gray-800">{currentLocation.description || 'No description available.'}</p>
              </CardContent>
              <CardFooter className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => openEditDialog(currentLocation)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" onClick={() => handleDelete(currentLocation.id)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-gray-500">No locations yet. Click "Add New Location" to create one!</p>
      )}

      {/* Carousel Navigation Buttons (show only if more than 1 location exists) */}
      {locations.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousLocation}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextLocation}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Button to create a new Location */}
      <Button onClick={openCreateDialog} className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> Add New Location
      </Button>

      {/* --- Dialog for Create/Edit Locations Form --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Create New Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation ? 'Change the details for this location.' : 'Fill in the details for a new location.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Location Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loc_name" className="text-right">
                Name
              </Label>
              <Input
                id="loc_name"
                {...form.register("loc_name")}
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.loc_name && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.loc_name.message}</p>
              )}
            </div>
            {/* User ID Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user_id" className="text-right">
                User ID
              </Label>
              <Input
                id="user_id"
                type="number" // Use type="number" for numeric input
                {...form.register("user_id")} // valueAsNumber: true is implied by coerce in zod schema
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.user_id && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.user_id.message}</p>
              )}
            </div>
            {/* Country ID Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country_id" className="text-right">
                Country ID
              </Label>
              <Input
                id="country_id"
                type="number"
                {...form.register("country_id")}
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.country_id && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.country_id.message}</p>
              )}
            </div>
            {/* Image URL Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image_url"
                {...form.register("image_url")}
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., https://example.com/image.jpg"
              />
              {form.formState.errors.image_url && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.image_url.message}</p>
              )}
            </div>
            {/* Latitude Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any" // Allows decimal numbers
                {...form.register("latitude")}
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.latitude && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.latitude.message}</p>
              )}
            </div>
            {/* Longitude Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any" // Allows decimal numbers
                {...form.register("longitude")}
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.longitude && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.longitude.message}</p>
              )}
            </div>
            {/* Description Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                {...form.register("description")}
                className="col-span-3 text-gray-900 bg-white border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Optional description"
              />
              {form.formState.errors.description && (
                <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.description.message}</p>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={closeFormDialog}>Cancel</Button>
              <Button type="submit">{editingLocation ? 'Save Changes' : 'Add Location'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Locations;