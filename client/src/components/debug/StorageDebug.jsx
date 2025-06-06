import React, { useState, useEffect } from "react";
import { listFiles } from "../../lib/storageUtils";
import { supabase } from "../../lib/supabaseClient";

function StorageDebug() {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [bucketInfo, setBucketInfo] = useState(null);

  const folders = ["businesses", "locations", "stylists"];

  const loadAllFiles = async () => {
    setLoading(true);
    const allFiles = {};

    for (const folder of folders) {
      const { files: folderFiles, error } = await listFiles(folder);
      allFiles[folder] = {
        files: folderFiles || [],
        error: error,
      };
    }

    setFiles(allFiles);
    setLoading(false);
  };

  const checkBucketStatus = async () => {
    try {
      // Try to list the bucket contents
      const { data, error } = await supabase.storage
        .from("salana-storage")
        .list("", { limit: 10 });

      setBucketInfo({
        accessible: !error,
        error: error?.message,
        rootFiles: data || [],
      });
    } catch (err) {
      setBucketInfo({
        accessible: false,
        error: err.message,
        rootFiles: [],
      });
    }
  };

  useEffect(() => {
    checkBucketStatus();
    loadAllFiles();
  }, []);

  const getFileUrl = (folder, fileName) => {
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("salana-storage")
      .getPublicUrl(`${folder}/${fileName}`);
    return publicUrl;
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        margin: "10px",
        borderRadius: "8px",
      }}
    >
      <h3>🔍 Storage Debug Panel</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4>Bucket Status</h4>
        {bucketInfo ? (
          <div>
            <p>
              <strong>Accessible:</strong>{" "}
              {bucketInfo.accessible ? "✅ Yes" : "❌ No"}
            </p>
            {bucketInfo.error && (
              <p>
                <strong>Error:</strong> {bucketInfo.error}
              </p>
            )}
            <p>
              <strong>Root files:</strong> {bucketInfo.rootFiles.length}
            </p>
          </div>
        ) : (
          <p>Loading bucket info...</p>
        )}
      </div>

      <button
        onClick={loadAllFiles}
        disabled={loading}
        style={{
          padding: "8px 16px",
          marginBottom: "20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Refresh Files"}
      </button>

      {folders.map((folder) => (
        <div
          key={folder}
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <h4>📁 {folder}/</h4>
          {files[folder] ? (
            <div>
              {files[folder].error ? (
                <p style={{ color: "red" }}>Error: {files[folder].error}</p>
              ) : (
                <div>
                  <p>
                    <strong>Files found:</strong> {files[folder].files.length}
                  </p>
                  {files[folder].files.length > 0 ? (
                    <ul>
                      {files[folder].files.map((file, index) => (
                        <li key={index} style={{ marginBottom: "8px" }}>
                          <strong>{file.name}</strong>
                          <span style={{ color: "#666", marginLeft: "8px" }}>
                            ({Math.round(file.metadata?.size / 1024 || 0)}KB)
                          </span>
                          <br />
                          <a
                            href={getFileUrl(folder, file.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "12px", color: "#007bff" }}
                          >
                            View file
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#666" }}>No files in this folder</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ))}

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#fff3cd",
          borderRadius: "4px",
        }}
      >
        <h4>💡 Troubleshooting Tips</h4>
        <ul style={{ margin: 0 }}>
          <li>If bucket is not accessible, check storage policies</li>
          <li>
            If files show here but not in dashboard, try refreshing dashboard
          </li>
          <li>If "View file" links don't work, bucket might not be public</li>
          <li>Check browser console for upload errors</li>
        </ul>
      </div>
    </div>
  );
}

export default StorageDebug;
