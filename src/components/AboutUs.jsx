import React from 'react';
import { Activity, Users, Award, GraduationCap } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto mt-16">

        {/* About Section */}
        <div className="space-y-8">

          {/* Project Overview */}
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold mb-4">About This Project</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                An advanced stock price prediction system using ensemble machine learning methods, 
                developed as part of academic mini project of ML at Army Institute of Technology, Pune.
              </p>
            </div>
          </div>

          {/* Project Guide */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                <Award className="w-8 h-8 text-yellow-400" />
                Project Guide
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-8 shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <span className="text-5xl font-bold text-white">NS</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Dr. Nikita Singhal</h3>
                  <p className="text-xl text-blue-300 mb-4">Associate Professor</p>
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg px-6 py-3 mb-4">
                    <p className="text-gray-300">Department of Computer Science & Engineering</p>
                    <p className="text-gray-400 text-sm">Army Institute of Technology, Pune</p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                Development Team
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300">4th Year Computer Science Engineering Students</p>
              <p className="text-gray-400 text-sm">Army Institute of Technology, Pune</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Member 1 */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">MK</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Mahindra Kumar</h3>
                <p className="text-sm text-blue-200 mb-1">Roll No: 7432</p>
                <p className="text-xs text-blue-300">Lead Developer</p>
              </div>

              {/* Member 2 */}
              <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">GR</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Gourav</h3>
                <p className="text-sm text-purple-200 mb-1">Roll No: 7423</p>
                <p className="text-xs text-purple-300">Algorithm Developer</p>
              </div>

              {/* Member 3 */}
              <div className="bg-gradient-to-br from-pink-900 to-pink-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">KD</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Khushia Dhaka</h3>
                <p className="text-sm text-pink-200 mb-1">Roll No: 7429</p>
                <p className="text-xs text-pink-300">UI/UX Designer</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutUs;
