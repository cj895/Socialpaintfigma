import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Analytics() {
  const kpiData = [
    { label: 'Total Generations', value: '2,431', trend: '+23%', isPositive: true, icon: TrendingUp },
    { label: 'Time Saved', value: '84h', trend: '+15%', isPositive: true, icon: Clock },
    { label: 'Style Accuracy', value: '94%', trend: '+2%', isPositive: true, icon: TrendingUp },
    { label: 'Content Published', value: '1,847', trend: '+18%', isPositive: true, icon: CheckCircle },
  ];

  const lineData = [
    { date: 'Oct 1', generations: 65 },
    { date: 'Oct 8', generations: 75 },
    { date: 'Oct 15', generations: 85 },
    { date: 'Oct 22', generations: 95 },
    { date: 'Oct 29', generations: 110 },
  ];

  const platformData = [
    { name: 'Instagram', value: 45, color: '#001B42' },
    { name: 'LinkedIn', value: 30, color: '#353CED' },
    { name: 'Twitter', value: 15, color: '#CDFF2A' },
    { name: 'Facebook', value: 10, color: '#00328F' },
  ];

  const contentTypeData = [
    { type: 'Social Post', count: 120 },
    { type: 'Story', count: 85 },
    { type: 'Carousel', count: 65 },
    { type: 'Event Graphic', count: 45 },
  ];

  return (
    <div className="p-8 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
          <h2 className="text-[#1F2937]">Analytics Dashboard</h2>
        </div>
        <Tabs defaultValue="30d">
          <TabsList className="bg-gray-100 rounded-xl">
            <TabsTrigger value="7d" className="rounded-lg">7 Days</TabsTrigger>
            <TabsTrigger value="30d" className="rounded-lg">30 Days</TabsTrigger>
            <TabsTrigger value="90d" className="rounded-lg">90 Days</TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 text-[#CDFF2A]" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      kpi.isPositive ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {kpi.trend}
                  </div>
                </div>
                <div>
                  <p className="text-3xl text-[#1F2937] mb-1">{kpi.value}</p>
                  <p className="text-sm text-[#6B7280]">{kpi.label}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Generation Activity */}
        <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
            <h3 className="text-[#1F2937]">Generation Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#353CED" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#CDFF2A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  color: '#1F2937'
                }}
              />
              <Area
                type="monotone"
                dataKey="generations"
                stroke="#353CED"
                strokeWidth={2}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
            <h3 className="text-[#1F2937]">Platform Distribution</h3>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2a2f4a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {platformData.map((platform) => (
              <div key={platform.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-sm text-[#9CA3AF]">{platform.name}</span>
                <span className="text-sm text-white ml-auto">{platform.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Type Distribution */}
      <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
          <h3 className="text-[#1F2937]">Content Type Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contentTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="type" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2a2f4a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#353CED" />
                <stop offset="100%" stopColor="#CDFF2A" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
