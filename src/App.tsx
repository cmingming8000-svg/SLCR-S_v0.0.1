import { useState, useMemo } from 'react';
import {
  Car, MapPin, Clock, Phone, Calendar, Users, Plane, Compass,
  ChevronRight, CheckCircle2, AlertCircle, Upload, FileText,
  Package, Luggage, Shield, Star, ArrowRight, Menu, X,
  CalendarDays, BarChart3, CircleDot, Trash2, Eye
} from 'lucide-react';

// ==================== TYPES ====================
interface Booking {
  id: string;
  type: 'rental' | 'carpool';
  vehicle?: string;
  serviceType?: string;
  date: string;
  time: string;
  pickup: string;
  destination?: string;
  hours?: number;
  contact: string;
  withDriver?: boolean;
  baggage?: string;
  totalPrice?: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'No-Show';
  submittedAt: string;
}

// ==================== VEHICLE DATA ====================
const vehicles = [
  { id: 'sedan', name: 'Sedan', model: 'Mitsubishi Mirage', rate: 150, icon: '🚗' },
  { id: 'suv', name: 'SUV', model: 'Toyota Avanza', rate: 200, icon: '🚙' },
  { id: 'pickup', name: 'Pickup', model: 'Isuzu D-Max', rate: 200, icon: '🛻' },
  { id: 'van', name: 'Hiace Van / L300', model: 'Toyota Hiace', rate: 250, icon: '🚐' },
];

const DRIVER_FEE = 100;

// ==================== SAMPLE BOOKINGS FOR ADMIN ====================
const sampleBookings: Booking[] = [
  { id: 'BK001', type: 'rental', vehicle: 'sedan', serviceType: 'Self-Drive', date: '2026-01-20', time: '08:00', pickup: 'SM City San Pablo', destination: 'Pagsanjan Falls', hours: 8, contact: '09171234567', withDriver: false, totalPrice: 1200, status: 'Confirmed', submittedAt: '2026-01-18' },
  { id: 'BK002', type: 'rental', vehicle: 'suv', serviceType: 'With Driver', date: '2026-01-20', time: '09:00', pickup: 'Seven Lakes Subd.', destination: 'Caliraya Lake', hours: 6, contact: '09189876543', withDriver: true, totalPrice: 1800, status: 'Pending', submittedAt: '2026-01-19' },
  { id: 'BK003', type: 'rental', vehicle: 'van', serviceType: 'With Driver', date: '2026-01-21', time: '06:00', pickup: 'NAIA Terminal 3', destination: 'San Pablo City', hours: 4, contact: '09201112233', withDriver: true, totalPrice: 1400, status: 'Confirmed', submittedAt: '2026-01-17' },
  { id: 'BK004', type: 'carpool', date: '2026-01-20', time: '07:30', pickup: 'San Pablo', destination: 'Manila (EDSA)', contact: '09154445566', baggage: 'Without baggage', status: 'Pending', submittedAt: '2026-01-19' },
  { id: 'BK005', type: 'carpool', date: '2026-01-21', time: '14:00', pickup: 'Starmalls EDSA', destination: 'San Pablo City', contact: '09167778899', baggage: 'With baggage', status: 'Cancelled', submittedAt: '2026-01-18' },
  { id: 'BK006', type: 'rental', vehicle: 'pickup', serviceType: 'Self-Drive', date: '2026-01-22', time: '10:00', pickup: 'Lucban, Quezon', destination: 'Mt. Banahaw', hours: 5, contact: '09173334455', withDriver: false, totalPrice: 1000, status: 'No-Show', submittedAt: '2026-01-16' },
];

// ==================== MAIN APP ====================
export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addBooking = (booking: Omit<Booking, 'id' | 'status' | 'submittedAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const tabs = [
    { label: 'Car Rental', icon: Car },
    { label: 'Carpool', icon: Users },
    { label: 'Admin Dashboard', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-navy-900 border-b border-navy-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-navy-900" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">Seven Lakes</h1>
                <p className="text-amber-400 text-xs font-medium">Car Rental</p>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === i
                      ? 'bg-amber-400 text-navy-900'
                      : 'text-gray-300 hover:text-white hover:bg-navy-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-800 border-t border-navy-700 px-4 py-3 space-y-1">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => { setActiveTab(i); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === i
                    ? 'bg-amber-400 text-navy-900'
                    : 'text-gray-300 hover:text-white hover:bg-navy-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {activeTab < 2 && <HeroSection />}

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 0 && <CarRentalForm onSubmit={addBooking} />}
        {activeTab === 1 && <CarpoolForm onSubmit={addBooking} />}
        {activeTab === 2 && (
          <AdminDashboard
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
            onDelete={deleteBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-navy-900" />
              </div>
              <span className="text-white font-semibold">Seven Lakes Car Rental</span>
            </div>
            <p className="text-sm text-center md:text-right">
              © 2026 Seven Lakes Car Rental. South Luzon, Philippines. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== HERO SECTION ====================
function HeroSection() {
  const badges = [
    { icon: Clock, text: 'Daily, Weekly & Long-Term Rentals' },
    { icon: Car, text: 'Self-Drive or With Driver' },
    { icon: Plane, text: 'Airport Transfers' },
    { icon: Compass, text: 'Tour Packages' },
  ];

  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">South Luzon's Trusted Mobility Partner</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Seven Lakes<br />
            <span className="text-amber-400">Car Rental</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Your Trusted Mobility Partner in South Luzon.{' '}
            <span className="text-amber-400 font-medium">Driven by Trust. Ready for Every Journey.</span>
          </p>

          {/* Service Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2.5 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <badge.icon className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#booking" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-xl transition-all amber-glow hover:scale-105">
              Book Now <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#fleet" className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 rounded-xl transition-all">
              View Fleet <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CAR RENTAL FORM ====================
function CarRentalForm({ onSubmit }: { onSubmit: (b: Omit<Booking, 'id' | 'status' | 'submittedAt'>) => void }) {
  const [serviceType, setServiceType] = useState<'self-drive' | 'with-driver'>('self-drive');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pickup: '',
    destination: '',
    hours: 1,
    contact: '',
  });
  const [filesUploaded, setFilesUploaded] = useState({ id1: false, id2: false, meralco: false });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const vehicle = vehicles.find(v => v.id === selectedVehicle)!;
  const driverFee = serviceType === 'with-driver' ? DRIVER_FEE : 0;
  const totalPrice = (vehicle.rate + driverFee) * formData.hours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.pickup || !formData.contact || !agreed) return;
    if (!filesUploaded.id1 || !filesUploaded.id2 || !filesUploaded.meralco) return;

    onSubmit({
      type: 'rental',
      vehicle: selectedVehicle,
      serviceType: serviceType === 'with-driver' ? 'With Driver' : 'Self-Drive',
      date: formData.date,
      time: formData.time,
      pickup: formData.pickup,
      destination: formData.destination,
      hours: formData.hours,
      contact: formData.contact,
      withDriver: serviceType === 'with-driver',
      totalPrice,
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div id="booking" className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Car Rental Booking</h2>
        <p className="text-gray-600">Choose your vehicle and schedule your ride</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Booking Submitted Successfully!</p>
            <p className="text-green-700 text-sm">We'll contact you shortly to confirm your reservation.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Type */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h3 className="font-semibold text-navy-900 text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            Service Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setServiceType('self-drive')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                serviceType === 'self-drive'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  serviceType === 'self-drive' ? 'bg-amber-400' : 'bg-gray-100'
                }`}>
                  <Car className={`w-5 h-5 ${serviceType === 'self-drive' ? 'text-navy-900' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Self-Drive</p>
                  <p className="text-sm text-gray-500">Drive yourself</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setServiceType('with-driver')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                serviceType === 'with-driver'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  serviceType === 'with-driver' ? 'bg-amber-400' : 'bg-gray-100'
                }`}>
                  <Users className={`w-5 h-5 ${serviceType === 'with-driver' ? 'text-navy-900' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">With Driver</p>
                  <p className="text-sm text-gray-500">+₱100/hr driver fee</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div id="fleet" className="bg-white rounded-2xl card-shadow p-6">
          <h3 className="font-semibold text-navy-900 text-lg mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-500" />
            Select Vehicle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVehicle(v.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedVehicle === v.id
                    ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400/20'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-3xl mb-2">{v.icon}</div>
                <p className="font-bold text-navy-900 text-sm">{v.name}</p>
                <p className="text-xs text-gray-500 mb-2">{v.model}</p>
                <span className="inline-block bg-navy-900 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                  ₱{v.rate}/hr
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h3 className="font-semibold text-navy-900 text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Booking Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rental Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Time *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Hours *</label>
              <input
                type="number"
                min={1}
                max={72}
                required
                value={formData.hours}
                onChange={e => setFormData({ ...formData, hours: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., SM City San Pablo"
                  value={formData.pickup}
                  onChange={e => setFormData({ ...formData, pickup: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., Pagsanjan Falls"
                  value={formData.destination}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="09XX XXX XXXX"
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Calculator */}
        <div className="bg-navy-900 rounded-2xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Price Estimate
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>{vehicle.name} ({vehicle.model}) × {formData.hours} hr(s)</span>
              <span>₱{(vehicle.rate * formData.hours).toLocaleString()}</span>
            </div>
            {serviceType === 'with-driver' && (
              <div className="flex justify-between text-gray-300">
                <span>Driver's Fee × {formData.hours} hr(s)</span>
                <span>₱{(DRIVER_FEE * formData.hours).toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-navy-600 pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold">Total Estimated Cost</span>
              <span className="text-3xl font-black text-amber-400">₱{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Requirements & Agreement */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h3 className="font-semibold text-navy-900 text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Requirements & Agreement
          </h3>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium mb-2">📋 Required Documents:</p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Two (2) Valid IDs (including Driver's License)</li>
              <li>• Latest Meralco Bill (proof of billing/address)</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <FileUploadButton
              label="Valid ID #1"
              uploaded={filesUploaded.id1}
              onUpload={() => setFilesUploaded({ ...filesUploaded, id1: true })}
            />
            <FileUploadButton
              label="Valid ID #2 (License)"
              uploaded={filesUploaded.id2}
              onUpload={() => setFilesUploaded({ ...filesUploaded, id2: true })}
            />
            <FileUploadButton
              label="Meralco Bill"
              uploaded={filesUploaded.meralco}
              onUpload={() => setFilesUploaded({ ...filesUploaded, meralco: true })}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
            />
            <span className="text-sm text-gray-700 group-hover:text-navy-900 transition-colors">
              I hereby agree to the <span className="text-amber-600 font-medium underline">Seven Lakes Car Rental Agreement</span>. 
              I confirm that all information provided is accurate and I accept full responsibility for the vehicle during the rental period. 
              I understand that damage, late returns, or fuel discrepancies will be charged accordingly.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!agreed || !filesUploaded.id1 || !filesUploaded.id2 || !filesUploaded.meralco}
          className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-navy-900 font-bold py-4 px-8 rounded-xl text-lg transition-all amber-glow hover:scale-[1.02] disabled:shadow-none flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Submit Booking Request
        </button>
      </form>
    </div>
  );
}

// ==================== FILE UPLOAD BUTTON ====================
function FileUploadButton({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) {
  return (
    <button
      type="button"
      onClick={onUpload}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all ${
        uploaded
          ? 'border-green-400 bg-green-50'
          : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
      }`}
    >
      {uploaded ? (
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      ) : (
        <Upload className="w-8 h-8 text-gray-400" />
      )}
      <span className={`text-xs font-medium ${uploaded ? 'text-green-700' : 'text-gray-600'}`}>
        {uploaded ? 'Uploaded ✓' : label}
      </span>
    </button>
  );
}

// ==================== CARPOOL FORM ====================
function CarpoolForm({ onSubmit }: { onSubmit: (b: Omit<Booking, 'id' | 'status' | 'submittedAt'>) => void }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    pickup: '',
    destination: '',
    contact: '',
    baggage: 'without',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: 'carpool',
      date: formData.date,
      time: formData.time,
      pickup: formData.pickup,
      destination: formData.destination,
      contact: formData.contact,
      baggage: formData.baggage === 'with' ? 'With baggage' : 'Without baggage',
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Carpool Booking</h2>
        <p className="text-gray-600">Share your ride, save on costs. Travel together!</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Carpool Request Submitted!</p>
            <p className="text-green-700 text-sm">We'll match you with a ride and notify you of the details.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow-lg p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
        {/* Carpool Info Banner */}
        <div className="bg-navy-900 rounded-xl p-5 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg">How Carpool Works</h3>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400" /> Submit your travel details</li>
            <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400" /> We'll match you with available rides</li>
            <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-amber-400" /> Share the ride cost with fellow passengers</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Travel *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder="e.g., San Pablo City Hall"
              value={formData.pickup}
              onChange={e => setFormData({ ...formData, pickup: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder="e.g., Ayala Mall Manila Bay"
              value={formData.destination}
              onChange={e => setFormData({ ...formData, destination: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              required
              placeholder="09XX XXX XXXX"
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Baggage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Baggage Status *</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, baggage: 'without' })}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.baggage === 'without'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Package className={`w-8 h-8 ${formData.baggage === 'without' ? 'text-amber-500' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${formData.baggage === 'without' ? 'text-navy-900' : 'text-gray-600'}`}>
                Without Baggage
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, baggage: 'with' })}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.baggage === 'with'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Luggage className={`w-8 h-8 ${formData.baggage === 'with' ? 'text-amber-500' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${formData.baggage === 'with' ? 'text-navy-900' : 'text-gray-600'}`}>
                With Baggage
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 text-navy-900 font-bold py-4 px-8 rounded-xl text-lg transition-all amber-glow hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Users className="w-5 h-5" />
          Request Carpool Ride
        </button>
      </form>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard({
  bookings,
  onUpdateStatus,
  onDelete,
}: {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDelete: (id: string) => void;
}) {
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Generate calendar days for the selected month
  const calendarDays = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [selectedMonth]);

  const getBookingsForDay = (day: number) => {
    const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.date === dateStr);
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Confirmed': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    'No-Show': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusDots: Record<string, string> = {
    'Pending': 'bg-yellow-500',
    'Confirmed': 'bg-green-500',
    'Cancelled': 'bg-red-500',
    'No-Show': 'bg-gray-500',
  };

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    noShow: bookings.filter(b => b.status === 'No-Show').length,
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage bookings, vehicle availability, and schedules</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Bookings" value={stats.total} color="bg-navy-900 text-white" />
        <StatCard label="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-700 border border-yellow-200" />
        <StatCard label="Confirmed" value={stats.confirmed} color="bg-green-50 text-green-700 border border-green-200" />
        <StatCard label="Cancelled" value={stats.cancelled} color="bg-red-50 text-red-700 border border-red-200" />
        <StatCard label="No-Show" value={stats.noShow} color="bg-gray-50 text-gray-700 border border-gray-200" />
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-navy-900 text-lg">Vehicle Availability Calendar</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'calendar' ? 'bg-white shadow text-navy-900' : 'text-gray-500'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'list' ? 'bg-white shadow text-navy-900' : 'text-gray-500'
                }`}
              >
                Matrix
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                const dayBookings = day ? getBookingsForDay(day) : [];
                return (
                  <div
                    key={i}
                    className={`min-h-[80px] p-1 rounded-lg border text-xs ${
                      day
                        ? dayBookings.length > 0
                          ? 'border-amber-200 bg-amber-50'
                          : 'border-gray-100 bg-gray-50'
                        : 'border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="font-medium text-gray-700 mb-1">{day}</div>
                        {dayBookings.slice(0, 2).map(b => (
                          <div
                            key={b.id}
                            className={`truncate rounded px-1 py-0.5 mb-0.5 text-[10px] font-medium cursor-pointer hover:opacity-80 ${statusColors[b.status]}`}
                            onClick={() => setSelectedBooking(b)}
                          >
                            {b.type === 'rental' ? '🚗' : '👥'} {b.id}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div className="text-[10px] text-gray-500">+{dayBookings.length - 2} more</div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Vehicle Matrix View */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-navy-900">Vehicle</th>
                  <th className="text-center py-3 px-2 font-semibold text-navy-900">Active Bookings</th>
                  <th className="text-center py-3 px-2 font-semibold text-navy-900">Availability</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => {
                  const vehicleBookings = bookings.filter(b => b.vehicle === v.id && b.status !== 'Cancelled');
                  const isAvailable = vehicleBookings.length === 0;
                  return (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{v.icon}</span>
                          <div>
                            <p className="font-medium text-navy-900">{v.name}</p>
                            <p className="text-xs text-gray-500">{v.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="inline-flex items-center gap-1 bg-navy-900 text-amber-400 px-2 py-1 rounded-full text-xs font-bold">
                          {vehicleBookings.length} booking(s)
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isAvailable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          <CircleDot className="w-3 h-3" />
                          {isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Management */}
      <div className="bg-white rounded-2xl card-shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-navy-900 text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            Booking Management
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Confirmed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Cancelled</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span> No-Show</span>
          </div>
        </div>

        <div className="space-y-3">
          {bookings.map(booking => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${statusDots[booking.status]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-navy-900">{booking.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                      <span className="text-xs bg-navy-900 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                        {booking.type === 'rental' ? '🚗 Rental' : '👥 Carpool'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {booking.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.pickup}</span>
                      {booking.destination && <span className="flex items-center gap-1"><Compass className="w-3 h-3" /> {booking.destination}</span>}
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.contact}</span>
                    </div>
                    {booking.type === 'rental' && (
                      <div className="mt-1 text-sm">
                        <span className="text-gray-500">
                          {vehicles.find(v => v.id === booking.vehicle)?.name} • {booking.serviceType} • {booking.hours}hr(s)
                        </span>
                        <span className="ml-2 font-bold text-amber-600">₱{booking.totalPrice?.toLocaleString()}</span>
                      </div>
                    )}
                    {booking.type === 'carpool' && booking.baggage && (
                      <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                        <Luggage className="w-3 h-3" /> {booking.baggage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6 lg:ml-0">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-navy-900 transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <select
                    value={booking.status}
                    onChange={e => onUpdateStatus(booking.id, e.target.value as Booking['status'])}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No-Show">No-Show</option>
                  </select>
                  <button
                    onClick={() => onDelete(booking.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 card-shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy-900">Booking {selectedBooking.id}</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[selectedBooking.status]}`}>
                  {selectedBooking.status}
                </span>
                <span className="text-xs bg-navy-900 text-amber-400 px-3 py-1 rounded-full font-medium">
                  {selectedBooking.type === 'rental' ? 'Car Rental' : 'Carpool'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p><span className="font-medium text-gray-700">Date:</span> {selectedBooking.date}</p>
                <p><span className="font-medium text-gray-700">Time:</span> {selectedBooking.time}</p>
                <p><span className="font-medium text-gray-700">Pick-up:</span> {selectedBooking.pickup}</p>
                {selectedBooking.destination && <p><span className="font-medium text-gray-700">Destination:</span> {selectedBooking.destination}</p>}
                {selectedBooking.type === 'rental' && (
                  <>
                    <p><span className="font-medium text-gray-700">Vehicle:</span> {vehicles.find(v => v.id === selectedBooking.vehicle)?.name} ({vehicles.find(v => v.id === selectedBooking.vehicle)?.model})</p>
                    <p><span className="font-medium text-gray-700">Service:</span> {selectedBooking.serviceType}</p>
                    <p><span className="font-medium text-gray-700">Duration:</span> {selectedBooking.hours} hour(s)</p>
                    <p><span className="font-medium text-gray-700">Total:</span> <span className="text-amber-600 font-bold">₱{selectedBooking.totalPrice?.toLocaleString()}</span></p>
                  </>
                )}
                {selectedBooking.type === 'carpool' && (
                  <p><span className="font-medium text-gray-700">Baggage:</span> {selectedBooking.baggage}</p>
                )}
                <p><span className="font-medium text-gray-700">Contact:</span> {selectedBooking.contact}</p>
                <p><span className="font-medium text-gray-700">Submitted:</span> {selectedBooking.submittedAt}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== STAT CARD ====================
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}
