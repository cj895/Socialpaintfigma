import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { FileUpload } from '../ui/file-upload';
import { UpgradePlanModal } from '../modals/UpgradePlanModal';
import { FigmaIntegration } from '../integrations/FigmaIntegration';
import { CheckCircle, Link2, Upload, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const [selectedCategory, setSelectedCategory] = useState('profile');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Parker',
    email: 'sarah@socialpaint.com',
    company: 'Creative Studio Inc.',
    role: 'Creative Director',
    profileImage: null as File | null
  });

  // Brand settings state
  const [brandData, setBrandData] = useState({
    brandName: 'socialpAInt',
    tagline: 'AI-Powered Creative Intelligence',
    primaryColor: '#353CED',
    secondaryColor: '#CDFF2A',
    accentColor: '#001B42',
    logo: null as File | null,
    brandVoice: 'Professional & Innovative'
  });

  // Learning preferences
  const [autoLearn, setAutoLearn] = useState(true);
  const [learningSensitivity, setLearningSensitivity] = useState([85]);
  const [platforms, setPlatforms] = useState({
    Instagram: true,
    LinkedIn: true,
    Twitter: true,
    Facebook: true,
    TikTok: false
  });

  const categories = [
    { id: 'profile', label: 'Profile' },
    { id: 'brand', label: 'Brand Settings' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'learning', label: 'AI Learning' },
    { id: 'team', label: 'Team & Access' },
    { id: 'billing', label: 'Billing & Plan' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const integrations = [
    { id: 'figma', name: 'Figma', connected: true, lastSync: '2 hours ago', icon: '🎨' },
    { id: 'adobe', name: 'Adobe Creative Suite', connected: false, lastSync: null, icon: '📐' },
    { id: 'canva', name: 'Canva', connected: true, lastSync: '1 day ago', icon: '🖌️' },
    { id: 'google', name: 'Google Drive', connected: false, lastSync: null, icon: '📁' },
  ];

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!', {
      description: 'Your changes have been saved.'
    });
  };

  const handleSaveBrand = () => {
    toast.success('Brand settings updated!', {
      description: 'socialpAInt is learning your new brand identity.'
    });
  };

  const handleConnectIntegration = (name: string) => {
    toast.success(`Connecting to ${name}...`, {
      description: 'Please authorize the connection in the popup window.'
    });
  };

  const handleProfileImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setProfileData({ ...profileData, profileImage: files[0] });
      toast.success('Profile photo uploaded!');
    }
  };

  const handleLogoUpload = (files: File[]) => {
    if (files.length > 0) {
      setBrandData({ ...brandData, logo: files[0] });
      toast.success('Brand logo uploaded!');
    }
  };

  return (
    <div className="flex h-full bg-[#FAFBFC]">
      {/* Left Sidebar */}
      <div className="w-64 p-6 border-r border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
          <h3 className="text-[#1F2937]">Settings</h3>
        </div>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#001B42] to-[#353CED] text-white shadow-md'
                  : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Profile Settings */}
        {selectedCategory === 'profile' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-[#1F2937] mb-2">Profile Settings</h2>
              <p className="text-[#6B7280]">Manage your personal information and account details</p>
            </div>

            <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
              <div className="space-y-6">
                {/* Profile Photo */}
                <div>
                  <label className="text-sm text-[#1F2937] mb-3 block">Profile Photo</label>
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-[#353CED] shadow-lg">
                      <AvatarFallback className="gradient-hero text-white text-2xl">
                        SP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <FileUpload
                        onFileSelect={handleProfileImageUpload}
                        accept="image/*"
                        maxSize={5}
                        label="Upload new photo"
                        description="JPG, PNG or GIF (max 5MB)"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#1F2937] mb-2 block">Full Name *</label>
                    <Input
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#1F2937] mb-2 block">Email Address *</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#1F2937] mb-2 block">Company</label>
                    <Input
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#1F2937] mb-2 block">Role</label>
                    <Input
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button onClick={handleSaveProfile} className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" className="border-gray-200 rounded-xl">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Brand Settings */}
        {selectedCategory === 'brand' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-[#1F2937] mb-2">Brand Settings</h2>
              <p className="text-[#6B7280]">Define your brand identity for AI learning</p>
            </div>

            <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="text-sm text-[#1F2937] mb-3 block">Brand Logo</label>
                  <FileUpload
                    onFileSelect={handleLogoUpload}
                    accept="image/*"
                    maxSize={10}
                    label="Upload brand logo"
                    description="SVG, PNG or JPG (max 10MB)"
                  />
                </div>

                {/* Brand Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#1F2937] mb-2 block">Brand Name</label>
                    <Input
                      value={brandData.brandName}
                      onChange={(e) => setBrandData({ ...brandData, brandName: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#1F2937] mb-2 block">Brand Voice</label>
                    <Input
                      value={brandData.brandVoice}
                      onChange={(e) => setBrandData({ ...brandData, brandVoice: e.target.value })}
                      className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                      placeholder="e.g., Professional, Playful, Bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#1F2937] mb-2 block">Tagline</label>
                  <Input
                    value={brandData.tagline}
                    onChange={(e) => setBrandData({ ...brandData, tagline: e.target.value })}
                    className="bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                  />
                </div>

                {/* Brand Colors */}
                <div>
                  <label className="text-sm text-[#1F2937] mb-3 block">Brand Colors</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-[#6B7280] mb-2 block">Primary</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={brandData.primaryColor}
                          onChange={(e) => setBrandData({ ...brandData, primaryColor: e.target.value })}
                          className="w-16 h-12 rounded-xl cursor-pointer"
                        />
                        <Input
                          value={brandData.primaryColor}
                          onChange={(e) => setBrandData({ ...brandData, primaryColor: e.target.value })}
                          className="flex-1 bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#6B7280] mb-2 block">Secondary</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={brandData.secondaryColor}
                          onChange={(e) => setBrandData({ ...brandData, secondaryColor: e.target.value })}
                          className="w-16 h-12 rounded-xl cursor-pointer"
                        />
                        <Input
                          value={brandData.secondaryColor}
                          onChange={(e) => setBrandData({ ...brandData, secondaryColor: e.target.value })}
                          className="flex-1 bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#6B7280] mb-2 block">Accent</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={brandData.accentColor}
                          onChange={(e) => setBrandData({ ...brandData, accentColor: e.target.value })}
                          className="w-16 h-12 rounded-xl cursor-pointer"
                        />
                        <Input
                          value={brandData.accentColor}
                          onChange={(e) => setBrandData({ ...brandData, accentColor: e.target.value })}
                          className="flex-1 bg-gray-50 border-gray-200 text-[#1F2937] rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button onClick={handleSaveBrand} className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Brand Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Integrations */}
        {selectedCategory === 'integrations' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-[#1F2937] mb-2">Integrations</h2>
              <p className="text-[#6B7280]\">Connect your design tools for seamless AI learning</p>
            </div>

            {/* Figma Integration - Primary */}
            <FigmaIntegration />

            {/* Other Integrations */}
            <div>
              <h3 className="text-sm font-medium text-[#1F2937] mb-4 mt-8">Other Integrations</h3>
              <div className="grid gap-4">
                {integrations.filter(i => i.id !== 'figma').map((integration) => (
                  <Card key={integration.id} className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-md">
                          <span className="text-3xl">{integration.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[#1F2937]">{integration.name}</h3>
                            {integration.connected && (
                              <Badge className="bg-[#10B981]/20 text-[#10B981] border-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                          {integration.connected ? (
                            <p className="text-sm text-[#6B7280]">
                              Last synced: {integration.lastSync}
                            </p>
                          ) : (
                            <p className="text-sm text-[#6B7280]">
                              Not connected
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleConnectIntegration(integration.name)}
                        className={integration.connected 
                          ? 'border-gray-200 rounded-xl' 
                          : 'bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm'
                        }
                        variant={integration.connected ? 'outline' : 'default'}
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        {integration.connected ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Learning Preferences */}
        {selectedCategory === 'learning' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-[#1F2937] mb-2">AI Learning Preferences</h2>
              <p className="text-[#6B7280]">Control how socialpAInt learns your creative style</p>
            </div>

            <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm space-y-6">
              {/* Auto-Learn Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-[#1F2937] mb-1">Auto-Learn Mode</p>
                  <p className="text-sm text-[#6B7280]">
                    Automatically learn from all your design work
                  </p>
                </div>
                <Switch
                  checked={autoLearn}
                  onCheckedChange={setAutoLearn}
                />
              </div>

              {/* Learning Sensitivity */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[#1F2937]">Learning Sensitivity</label>
                  <Badge className="bg-[#353CED]/20 text-[#353CED]">
                    {learningSensitivity[0]}%
                  </Badge>
                </div>
                <Slider
                  value={learningSensitivity}
                  onValueChange={setLearningSensitivity}
                  min={0}
                  max={100}
                  step={5}
                  className="mb-2"
                />
                <p className="text-xs text-[#6B7280]">
                  Higher sensitivity captures more subtle design patterns
                </p>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="text-[#1F2937] mb-3 block">Platforms to Learn From</label>
                <div className="space-y-2">
                  {Object.entries(platforms).map(([platform, enabled]) => (
                    <label
                      key={platform}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-[#1F2937]">{platform}</span>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setPlatforms({ ...platforms, [platform]: checked })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-gray-200">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[#1F2937] mb-1">Reset Style Profile</p>
                      <p className="text-sm text-[#6B7280] mb-3">
                        This will permanently delete all learned styles and patterns
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => toast.error('Are you sure? This cannot be undone.')}
                      >
                        Reset All Learning Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Billing */}
        {selectedCategory === 'billing' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-[#1F2937] mb-2">Billing & Subscription</h2>
              <p className="text-[#6B7280]">Manage your plan and billing information</p>
            </div>

            <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl text-[#1F2937]">Professional Plan</h3>
                    <Badge className="bg-gradient-to-r from-[#001B42] to-[#353CED] text-white">
                      Active
                    </Badge>
                  </div>
                  <p className="text-[#6B7280]">$29/month • Renews on Dec 21, 2025</p>
                </div>
                <Button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
                >
                  Change Plan
                </Button>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">AI Generations</span>
                  <span className="text-[#1F2937]">234 / 500 this month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Storage Used</span>
                  <span className="text-[#1F2937]">6.7 GB / 50 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Team Members</span>
                  <span className="text-[#1F2937]">3 / 5</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                <Button variant="outline" className="border-gray-200 rounded-xl">
                  View Billing History
                </Button>
                <Button variant="outline" className="border-gray-200 rounded-xl">
                  Update Payment Method
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradePlanModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}