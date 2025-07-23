import { CheckCircle, Clock, Target, Users, DollarSign, MessageSquare, TrendingUp } from "lucide-react";

interface PhaseContentProps {
  phase: string;
}

const PhaseContent = ({ phase }: PhaseContentProps) => {
  const getPhaseContent = () => {
    switch (phase) {
      case 'validation':
        return {
          title: 'Idea Validation',
          icon: Target,
          description: 'Validate your startup idea with real customers',
          tasks: [
            'Conduct 20+ customer interviews',
            'Create customer personas',
            'Define problem-solution fit',
            'Analyze market size and competition',
            'Validate pricing assumptions'
          ],
          tips: [
            'Ask open-ended questions to avoid bias',
            'Focus on problems, not solutions',
            'Look for patterns in customer responses',
            'Test your assumptions, don\'t just confirm them'
          ]
        };
      case 'mvp':
        return {
          title: 'Minimum Viable Product',
          icon: Target,
          description: 'Build and test your MVP with early users',
          tasks: [
            'Define core features',
            'Create wireframes and mockups',
            'Build MVP prototype',
            'Recruit beta testers',
            'Collect user feedback'
          ],
          tips: [
            'Start with the simplest version possible',
            'Focus on core value proposition',
            'Use no-code tools when possible',
            'Get feedback early and often'
          ]
        };
      case 'launch':
        return {
          title: 'Product Launch',
          icon: TrendingUp,
          description: 'Launch your product to the market',
          tasks: [
            'Create launch strategy',
            'Build landing page',
            'Set up analytics',
            'Execute marketing campaigns',
            'Monitor launch metrics'
          ],
          tips: [
            'Plan your launch timeline carefully',
            'Have a backup plan ready',
            'Engage with your community',
            'Be ready to handle feedback'
          ]
        };
      case 'monetization':
        return {
          title: 'Monetization',
          icon: DollarSign,
          description: 'Implement and optimize revenue streams',
          tasks: [
            'Choose revenue model',
            'Set up payment systems',
            'Create pricing strategy',
            'Implement billing logic',
            'Track financial metrics'
          ],
          tips: [
            'Start with simple pricing',
            'Test different price points',
            'Focus on customer lifetime value',
            'Monitor churn rates closely'
          ]
        };
      case 'feedback':
        return {
          title: 'Feedback & Iterate',
          icon: MessageSquare,
          description: 'Collect feedback and improve your product',
          tasks: [
            'Set up feedback channels',
            'Analyze user behavior',
            'Prioritize feature requests',
            'Implement improvements',
            'Measure impact of changes'
          ],
          tips: [
            'Listen more than you speak',
            'Look for patterns in feedback',
            'Not all feedback should be acted upon',
            'Focus on user outcomes, not features'
          ]
        };
      case 'scale':
        return {
          title: 'Pitch & Scale',
          icon: Users,
          description: 'Scale your business and attract investment',
          tasks: [
            'Create pitch deck',
            'Define growth strategy',
            'Build scalable systems',
            'Network with investors',
            'Prepare for funding rounds'
          ],
          tips: [
            'Tell a compelling story',
            'Focus on traction and metrics',
            'Build relationships before you need money',
            'Have a clear use of funds'
          ]
        };
      default:
        return {
          title: 'Phase Content',
          icon: Clock,
          description: 'Content for this phase',
          tasks: [],
          tips: []
        };
    }
  };

  const content = getPhaseContent();
  const Icon = content.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-card rounded-xl p-8 border border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg">
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <p className="text-muted-foreground text-lg">{content.description}</p>
          </div>
        </div>
      </div>

      {/* Tasks Checklist */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-2xl font-bold mb-6">Phase Tasks</h2>
        <div className="space-y-4">
          {content.tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                <CheckCircle size={16} className="text-primary opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-medium">{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips and Best Practices */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-2xl font-bold mb-6">Tips & Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.tips.map((tip, index) => (
            <div key={index} className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-accent-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Actions */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to make progress?</h3>
          <p className="text-muted-foreground">
            Complete the tasks above to advance to the next phase of your startup journey.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-quest">
              Mark Phase Complete
            </button>
            <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200">
              Get Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseContent;