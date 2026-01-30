import { supabase } from '../utils/supabaseClient';

/**
 * Fetch all photos ordered by display_order
 * @returns {Promise<Array|null>} Array of photos or null on error
 */
export async function fetchPhotos() {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching photos:', error);
    return null;
  }

  return data;
}

/**
 * Upload a photo to storage and create database record
 * @param {File} file - The image file to upload
 * @param {Object} metadata - { title, location }
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function uploadPhoto(file, metadata = {}) {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const storagePath = `photos/${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(storagePath, file);

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    return { success: false, error: 'Failed to upload photo' };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(storagePath);

  // Get max display_order
  const { data: maxOrderData } = await supabase
    .from('photos')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = (maxOrderData?.[0]?.display_order ?? -1) + 1;

  // Create database record
  const { data, error: insertError } = await supabase
    .from('photos')
    .insert({
      storage_path: storagePath,
      url: publicUrl,
      title: metadata.title || null,
      location: metadata.location || null,
      display_order: nextOrder
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating photo record:', insertError);
    // Try to clean up uploaded file
    await supabase.storage.from('photos').remove([storagePath]);
    return { success: false, error: 'Failed to save photo' };
  }

  return { success: true, data };
}

/**
 * Delete a photo from storage and database
 * @param {string} id - Photo UUID
 * @param {string} storagePath - Storage path for cleanup
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deletePhoto(id, storagePath) {
  // Delete from database first
  const { error: dbError } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting photo record:', dbError);
    return { success: false, error: 'Failed to delete photo' };
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([storagePath]);

  if (storageError) {
    console.error('Error deleting photo file:', storageError);
    // DB record already deleted, log but don't fail
  }

  return { success: true };
}

/**
 * Update photo display order
 * @param {string} id - Photo UUID
 * @param {number} newOrder - New display_order value
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updatePhotoOrder(id, newOrder) {
  const { error } = await supabase
    .from('photos')
    .update({ display_order: newOrder, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating photo order:', error);
    return { success: false, error: 'Failed to update order' };
  }

  return { success: true };
}

/**
 * Reorder photos - swap two photos' positions
 * @param {Array} photos - Current photos array
 * @param {number} fromIndex - Index to move from
 * @param {number} toIndex - Index to move to
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function reorderPhotos(photos, fromIndex, toIndex) {
  const reordered = [...photos];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);

  // Update all display_order values
  const updates = reordered.map((photo, index) =>
    supabase
      .from('photos')
      .update({ display_order: index })
      .eq('id', photo.id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some(r => r.error);

  if (hasError) {
    console.error('Error reordering photos');
    return { success: false, error: 'Failed to reorder photos' };
  }

  return { success: true };
}
