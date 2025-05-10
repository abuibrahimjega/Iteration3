import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const resourcesCol = collection(db, "resources");

/**
 * Fetch all resources once, ordered by createdAt desc.
 */
export async function getResources() {
  try {
    const q = query(resourcesCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw new Error("Failed to fetch resources: " + error.message);
  }
}

/**
 * Subscribe to real-time updates of resources.
 * @param {(resources: Array)} callback - Success callback
 * @param {(error: Error)} errorCallback - Error callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeResources(callback, errorCallback = console.error) {
  try {
    const q = query(resourcesCol, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(list);
      },
      (error) => {
        console.error("Resources subscription error:", error);
        if (errorCallback) errorCallback(error);
      }
    );
    return unsub;
  } catch (error) {
    console.error("Error setting up resources subscription:", error);
    if (errorCallback) errorCallback(error);
    // Return a no-op function as fallback
    return () => {};
  }
}

/**
 * Add a new resource.
 * @param {Object} resource - The resource to add
 * @param {string} resource.title - Resource title
 * @param {string} resource.url - Resource URL
 * @returns {Promise} - Promise resolving to the document reference
 */
export async function addResource({ title, url }) {
  try {
    if (!title || !title.trim()) {
      throw new Error("Resource title is required");
    }

    if (!url || !url.trim()) {
      throw new Error("Resource URL is required");
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      throw new Error("Invalid URL format");
    }

    const newResource = {
      title: title.trim(),
      url: url.trim(),
      createdAt: serverTimestamp(),
    };

    return await addDoc(resourcesCol, newResource);
  } catch (error) {
    console.error("Error adding resource:", error);
    throw error;
  }
}

/**
 * Delete a resource by ID.
 * @param {string} id - Resource document ID
 * @returns {Promise<void>}
 */
export async function deleteResource(id) {
  try {
    if (!id) {
      throw new Error("Resource ID is required");
    }

    const docRef = doc(resourcesCol, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw new Error("Failed to delete resource: " + error.message);
  }
}
