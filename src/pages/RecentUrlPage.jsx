import React, { useState, useEffect } from "react";
import {
  Clock,
  Globe,
  Eye,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { getRecentUrl } from "../api/getRecentUrl.api.js";
import { useAuth } from '@clerk/clerk-react';

export default function RecentURLsPage() {
  const [recentUrls, setRecentUrls] = useState([]);
  const {userId} = useAuth();
  const clerkId = userId
  // console.log("clerkId",clerkId);

  useEffect(() => {
    const getUrl = async () => {
      const respone = await getRecentUrl(clerkId);
      // console.log("get url response", respone?.data);
      setRecentUrls(respone?.data?.getUrl);
      // console.log("recent url", recentUrls);
    };
    getUrl();
  }, [clerkId]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Recent Scan</h1>
            </div>
          </div>

          {recentUrls.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Recent URLs found
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUrls.map((urlData) => (
                <div
                  key={urlData.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="sm:flex items-center justify-between">      

                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a
                          href={urlData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 truncate text-xl flex items-center gap-1"
                        >
                          {urlData.url}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                    
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-gray-700">
                          Last Scan
                        </span>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-purple-800">
                          {formatTimestamp(urlData.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
