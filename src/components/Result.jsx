import React, { useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Shield,
  AlertTriangle,
  Info,
  Zap,
  Clock1,
  Globe,
  Download,
  Mail,
} from "lucide-react";

import { downloadAccessbilityReport } from "../api/report.api";
import { toast } from "react-toastify";

function Result({ results }) {
  const [activeTab, setActiveTab] = useState("summary");

  const downloadAccessbilityReportHandle = async () => {
    try {
      const response = await downloadAccessbilityReport(results);
      // console.log(results);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Report downloaded successfully!");
    } catch (error) {
      if (error.response.status === 413) {
        toast.error(
          "This report is too large to download."
        );
      } else {
        toast.error("Something went wrong while downloading.");
      }
      // toast.error("Network error. Please try again.");
    }
  };

  const getImpactIcon = (impact) => {
    const iconProps = { className: "w-5 h-5" };
    switch (impact) {
      case "critical":
        return <AlertCircle {...iconProps} className="w-5 h-5 text-red-500" />;
      case "serious":
        return (
          <AlertTriangle {...iconProps} className="w-5 h-5 text-orange-500" />
        );
      case "moderate":
        return <Info {...iconProps} className="w-5 h-5 text-yellow-500" />;
      case "minor":
        return <Shield {...iconProps} className="w-5 h-5 text-blue-500" />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "serious":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "minor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getScoreColor = () => {
    const total = results.summary.totalViolations;
    const critical = results.summary.criticalCount;
    const serious = results.summary.seriousCount;

    if (critical > 0 || serious > 5)
      return "text-red-600 bg-red-50 border border-red-600";
    if (serious > 0 || total > 10)
      return "text-orange-600 bg-orange-50 border-orange-600";
    if (total > 0) return "text-yellow-600 bg-yellow-50 border-yellow-600";
    return "text-green-600 bg-green-50 border-green-600";
  };

  const getScoreText = () => {
    const total = results.summary.totalViolations;
    const critical = results.summary.criticalCount;
    const serious = results.summary.seriousCount;

    if (total === 0) return "Status Excellent & Score: 95/100";
    if (critical === 0 && serious === 0) return "Status Good & Score: 75/100";
    if (critical === 0 && serious <= 3)
      return "Status Needs Work & Score: 55/100";
    return "Status Poor & Score: 35/100";
  };
  return (
    <>
      {results && (
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="flex text-3xl font-bold text-white mb-2 gap-4">
                  Report
                </h1>
              </div>
              <div className="flex gap-4">
                <button
                  className="inline-flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 rounded-xl sm:font-semibold   hover:bg-blue-50 hover:text-blue-700 transform hover:scale-105 transition-all duration-200 ease-out shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => downloadAccessbilityReportHandle(results)}
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl py-3">
            <div className="p-6 space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-700">Target URL</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <code className="text-sm text-blue-800 break-all">
                    {results.url}
                  </code>
                </div>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-gray-700">Last Scan</span>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-800">
                    {formatTimestamp(results.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className={`items-center px-4 py-2 md:px-6 md:py-4 rounded-2xl font-bold text-lg md:text-xl ${getScoreColor()}`}
            >
              {getScoreText()}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-10">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">
                {results.summary.totalViolations}
              </div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {results.summary.criticalCount}
              </div>
              <div className="text-sm text-red-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {results.summary.seriousCount}
              </div>
              <div className="text-sm text-orange-600">Serious</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {results.summary.moderateCount}
              </div>
              <div className="text-sm text-yellow-600">Moderate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {results.summary.minorCount}
              </div>
              <div className="text-sm text-blue-600">Minor</div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "summary", name: "Summary", icon: Shield },
                { id: "urgent", name: "Urgent Issues", icon: AlertCircle },
                { id: "top", name: "Top Issues", icon: Zap },
                {
                  id: "actionable",
                  name: "Action Items",
                  icon: CheckCircle2,
                },
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-4 px-2 border-b-2 cursor-pointer font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "summary" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Accessibility Summary
                  </h3>
                  {results.summary.totalViolations === 0 ? (
                    <div className="text-center py-12 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-700">
                        Perfect Score!
                      </h3>
                      <p className="text-green-600">
                        No accessibility violations found on this page.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Issue Distribution
                        </h4>
                        <div className="space-y-3">
                          {[
                            {
                              label: "Critical",
                              count: results.summary.criticalCount,
                              color: "red",
                            },
                            {
                              label: "Serious",
                              count: results.summary.seriousCount,
                              color: "orange",
                            },
                            {
                              label: "Moderate",
                              count: results.summary.moderateCount,
                              color: "yellow",
                            },
                            {
                              label: "Minor",
                              count: results.summary.minorCount,
                              color: "blue",
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-700">
                                {item.label}
                              </span>
                              <span
                                className={`font-bold text-${item.color}-600`}
                              >
                                {item.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Quick Stats
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total Issues:</span>
                            <span className="font-bold">
                              {results.summary.totalViolations}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">
                              Priority Issues:
                            </span>
                            <span className="font-bold text-red-600">
                              {results.summary.criticalCount +
                                results.summary.seriousCount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Action Items:</span>
                            <span className="font-bold">
                              {results.actionableItems?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "urgent" && (
              <div>
                <h3 className="text-xl font-bold mb-6">
                  Critical & Serious Issues
                </h3>
                {results.urgentIssues?.length === 0 ? (
                  <div className="text-center py-12 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700">
                      No Urgent Issues!
                    </h3>
                    <p className="text-green-600">
                      All critical and serious accessibility issues have been
                      resolved.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results.urgentIssues?.map((violation, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          {getImpactIcon(violation.impact)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {violation.description}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${getImpactColor(
                                  violation.impact
                                )}`}
                              >
                                {violation.impact.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                              {violation.help}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span className="font-medium">
                                {violation.nodeCount} element(s) affected
                              </span>
                              <a
                                href={violation.helpUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                Learn more →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "top" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Most Common Issues</h3>
                <div className="space-y-4">
                  {results.topIssues?.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        {getImpactIcon(issue.impact)}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {issue.description}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Rule: {issue.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-white rounded-lg font-bold text-gray-900">
                          {issue.count} instances
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getImpactColor(
                            issue.impact
                          )}`}
                        >
                          {issue.impact.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "actionable" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Your Action Plan</h3>
                <div className="space-y-4">
                  {results.actionableItems?.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${getImpactColor(
                                item.priority
                              )}`}
                            >
                              {item.priority.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">
                              {item.elementsAffected} element(s) affected
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">
                            {item.issue}
                          </h4>
                          <p className="text-gray-600 mb-4">{item.solution}</p>
                          <a
                            href={item.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            View Documentation →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Result;
