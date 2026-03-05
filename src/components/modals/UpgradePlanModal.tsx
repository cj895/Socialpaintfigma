import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      icon: Sparkles,
      color: '#6B7280',
      gradient: 'from-gray-400 to-gray-600',
      popular: false,
      features: [
        '50 AI generations per month',
        'Basic style learning',
        '3 platform integrations',
        '1 GB storage',
        'Standard support',
        'Watermarked exports'
      ],
      limitations: [
        'No custom fonts',
        'Limited templates'
      ]
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      icon: Zap,
      color: '#001B42',
      gradient: 'from-[#001B42] to-[#00328F]',
      popular: true,
      features: [
        '500 AI generations per month',
        'Advanced style DNA learning',
        'Unlimited platform integrations',
        '50 GB storage',
        'Priority support',
        'No watermarks',
        'Custom brand fonts',
        'Advanced analytics',
        'Team collaboration (up to 5)',
        'API access',
        'Custom templates'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      icon: Crown,
      color: '#CDFF2A',
      gradient: 'from-[#CDFF2A] to-[#10B981]',
      popular: false,
      features: [
        'Unlimited AI generations',
        'Enterprise-grade style AI',
        'Unlimited everything',
        '500 GB storage',
        'Dedicated support',
        'White-label options',
        'Custom AI model training',
        'Advanced team management',
        'SSO & advanced security',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated account manager'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = (planName: string, price: string) => {
    if (price === 'Free') {
      toast.info('You\'re already on the Starter plan!');
      return;
    }
    
    toast.success(`Upgrading to ${planName}...`, {
      description: 'Redirecting to secure checkout'
    });
    
    // Simulate redirect to payment
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <div className="text-center space-y-2 mb-4 sm:mb-6">
            <DialogTitle className="text-2xl sm:text-3xl text-[#1F2937]">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-[#6B7280]">
              Unlock the full power of socialpAInt AI
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 p-4 sm:p-6 ${
                  plan.popular 
                    ? 'border-[#353CED] shadow-xl lg:scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-[#001B42] to-[#00328F] text-white px-3 sm:px-4 py-1 text-xs sm:text-sm">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-lg sm:text-xl text-[#1F2937] mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl text-[#1F2937]">{plan.price}</span>
                  <span className="text-[#6B7280] text-xs sm:text-sm ml-2">{plan.period}</span>
                </div>

                {/* Features */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 min-h-[200px] sm:min-h-[280px]">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#10B981]" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#1F2937] leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(plan.name, plan.price)}
                  className={`w-full rounded-xl text-sm sm:text-base ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#001B42] to-[#00328F] hover:from-[#000A1A] hover:to-[#00266B] text-white'
                      : plan.price === 'Free'
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      : 'bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028]'
                  } shadow-sm`}
                >
                  {plan.price === 'Free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl mb-1">💳</p>
              <p className="text-sm text-[#1F2937]">Cancel Anytime</p>
              <p className="text-xs text-[#6B7280]">No long-term contracts</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl mb-1">🔒</p>
              <p className="text-sm text-[#1F2937]">Secure Payment</p>
              <p className="text-xs text-[#6B7280]">256-bit SSL encryption</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl mb-1">💰</p>
              <p className="text-sm text-[#1F2937]">Money-back Guarantee</p>
              <p className="text-xs text-[#6B7280]">14-day refund policy</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-[#6B7280] mt-4 px-2">
          All plans include automatic updates and new features • No credit card required for free plan
        </p>
      </DialogContent>
    </Dialog>
  );
}
