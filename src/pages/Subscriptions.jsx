import React from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { Check, Star } from 'lucide-react'

const Subscriptions = () => {
  const screenSize = useResponsive()

  const plans = [
    {
      id: 1,
      name: 'Merit Basic',
      description: 'Essential features for job seekers',
      price: 'Free',
      period: 'forever',
      popular: false,
      current: true,
      features: [
        'Basic job search',
        'Up to 5 applications/month', 
        'Standard support',
        'Basic resume builder'
      ]
    },
    {
      id: 2,
      name: 'Merit Pro',
      description: 'Advanced tools for professionals',
      price: '$19.99',
      period: 'month',
      popular: true,
      current: false,
      features: [
        'Unlimited applications',
        'Premium job listings',
        'Advanced filters',
        'Priority support',
        'Resume analysis',
        'Career consultation'
      ]
    },
    {
      id: 3,
      name: 'Merit Enterprise',
      description: 'Complete career solution',
      price: '$49.99',
      period: 'month',
      popular: false,
      current: false,
      features: [
        'Everything in Pro',
        'Personal career coach',
        'Interview preparation',
        'Salary negotiation help',
        'LinkedIn optimization',
        'Portfolio building'
      ]
    }
  ]



  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ 
        padding: screenSize.isDesktop 
          ? '24px 32px 24px 32px' 
          : screenSize.isTablet
            ? '20px 20px 20px 20px'
            : '16px 12px 90px 12px'
      }}>
        


        {/* Plans List */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: screenSize.isMobile 
            ? '1fr' 
            : screenSize.isTablet 
              ? 'repeat(2, 1fr)' 
              : 'repeat(3, 1fr)',
          gap: getGridGap(screenSize)
        }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: plan.popular ? '2px solid #16a34a' : '1px solid #f0f0f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              position: 'relative',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              if (!plan.popular) {
                e.target.style.borderColor = '#16a34a'
                e.target.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!plan.popular) {
                e.target.style.borderColor = '#f0f0f0'
                e.target.style.transform = 'translateY(0)'
              }
            }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Star size={10} />
                  Most Popular
                </div>
              )}

              {/* Current Plan Badge */}
              {plan.current && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '11px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  CURRENT
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 4px 0'
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: '0 0 12px 0'
                }}>
                  {plan.description}
                </p>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1a1a1a'
                }}>
                  {plan.price === 'Free' ? 'Free' : plan.price}
                  {plan.price !== 'Free' && (
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#64748b'
                    }}>
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 12px 0'
                }}>
                  What's included
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Check size={16} color="#16a34a" />
                      <span style={{
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button style={{
                width: '100%',
                backgroundColor: plan.current ? '#f3f4f6' : plan.popular ? '#16a34a' : 'white',
                color: plan.current ? '#64748b' : plan.popular ? 'white' : '#16a34a',
                border: plan.current ? 'none' : plan.popular ? 'none' : '1px solid #16a34a',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: plan.current ? 'default' : 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                if (!plan.current && !plan.popular) {
                  e.target.style.backgroundColor = '#f0fdf4'
                } else if (!plan.current && plan.popular) {
                  e.target.style.backgroundColor = '#15803d'
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.current && !plan.popular) {
                  e.target.style.backgroundColor = 'white'
                } else if (!plan.current && plan.popular) {
                  e.target.style.backgroundColor = '#16a34a'
                }
              }}
              >
                {plan.current ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>


      </div>
    </div>
  )
}

export default Subscriptions