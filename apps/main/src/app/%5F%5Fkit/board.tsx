'use client';
import { useState } from 'react';
import {
  AlertDialog,
  Checkbox,
  Dialog,
  Menu,
  MenuItem,
  MenuSeparator,
  PrimaryButton,
  RadioGroup,
  SecondaryButton,
  Select,
  Switch,
  Tabs,
  Tooltip,
  Popover,
  useToast,
  useI18n
} from '@rc/ui';

/* Development board for the UI kit (K-01). Every wrapper gets a section here as it lands. */
export function KitBoard() {
  const { t } = useI18n();
  const { show } = useToast();
  const [glass, setGlass] = useState(false);
  const [hard, setHard] = useState(false);
  const [alert, setAlert] = useState(false);
  const [done, setDone] = useState('');
  const [checked, setChecked] = useState(false);
  const [on, setOn] = useState(false);
  const [vehicle, setVehicle] = useState('truck-a');
  const [week, setWeek] = useState('');
  const [tab, setTab] = useState('w1');
  return (
    <main className="mx-auto max-w-[1200px] p-6 flex flex-col gap-6">
      <h1 className="text-[24px] font-extrabold">{t('kit.title')}</h1>
      <p className="m-0 text-[15px] font-semibold text-[var(--text-secondary)]">{t('kit.note')}</p>

      <section className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
        <h2 className="text-[18px] font-extrabold">Dialog</h2>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={() => setGlass(true)}>Glass dialog</SecondaryButton>
          <SecondaryButton onClick={() => setHard(true)}>Hard dialog</SecondaryButton>
        </div>
        <Dialog
          open={glass}
          onOpenChange={setGlass}
          title="Glass dialog"
          description="Focus moves inside, Escape closes, focus returns to the trigger."
          footer={<PrimaryButton onClick={() => setGlass(false)}>Close</PrimaryButton>}
        >
          <p className="m-0 text-[15px] font-semibold">The content sits on a glass panel.</p>
        </Dialog>
        <Dialog
          open={hard}
          onOpenChange={setHard}
          title="Hard dialog"
          hard
          footer={
            <PrimaryButton className="hard-btn" onClick={() => setHard(false)}>
              Close
            </PrimaryButton>
          }
        >
          <p className="m-0 text-[15px] font-semibold">The same wrapper with the hard logistics style.</p>
        </Dialog>
      </section>

      <section className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
        <h2 className="text-[18px] font-extrabold">Menu</h2>
        <div className="flex flex-wrap gap-2">
          <Menu trigger={<SecondaryButton>Glass menu</SecondaryButton>} align="start">
            <MenuItem onSelect={() => setDone('First action picked')}>First action</MenuItem>
            <MenuItem onSelect={() => setDone('Second action picked')}>Second action</MenuItem>
            <MenuSeparator />
            <MenuItem disabled>Disabled action</MenuItem>
          </Menu>
          <Menu
            trigger={<SecondaryButton className="hard-thin !rounded-xl">Hard menu</SecondaryButton>}
            align="start"
            hard
          >
            <MenuItem onSelect={() => setDone('Hard action picked')}>Hard action</MenuItem>
            <MenuItem disabled>Disabled action</MenuItem>
          </Menu>
        </div>
      </section>

      <section className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-4">
        <h2 className="text-[18px] font-extrabold">Controls</h2>
        <Checkbox checked={checked} onCheckedChange={setChecked} label="Add to cluster" hint="44px target on phone" />
        <Switch checked={on} onCheckedChange={setOn} label="Only open slots" />
        <RadioGroup
          value={vehicle}
          onValueChange={setVehicle}
          label="Vehicle"
          options={[
            { value: 'truck-a', label: 'Truck A' },
            { value: 'truck-b', label: 'Truck B' }
          ]}
        />
        <div className="max-w-[240px]">
          <Select
            value={week}
            onValueChange={setWeek}
            label="Week"
            placeholder="Pick a week"
            options={[
              { value: 'w1', label: 'Week 1' },
              { value: 'w2', label: 'Week 2' },
              { value: 'w3', label: 'Week 3' }
            ]}
          />
        </div>
        <Tabs
          value={tab}
          onValueChange={setTab}
          label="Weeks"
          items={[
            { value: 'w1', label: 'W1' },
            { value: 'w2', label: 'W2' },
            { value: 'w3', label: 'W3' }
          ]}
        />
      </section>

      <section className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
        <h2 className="text-[18px] font-extrabold">Toast, Popover, Tooltip</h2>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton
            onClick={() =>
              show('Haul H-07 marked Delivered', { label: 'Undo', onClick: () => setDone('Haul undone.') })
            }
          >
            Fire toast with Undo
          </SecondaryButton>
          <Popover trigger={<SecondaryButton>Open popover</SecondaryButton>}>
            <p className="m-0 text-[15px] font-semibold">Popover body. Escape closes it.</p>
          </Popover>
          <Tooltip label="Sample tooltip">
            <SecondaryButton>Hover or focus me</SecondaryButton>
          </Tooltip>
        </div>
      </section>

      <section className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
        <h2 className="text-[18px] font-extrabold">AlertDialog</h2>
        <SecondaryButton onClick={() => setAlert(true)}>Delete farm (type DELETE)</SecondaryButton>
        <AlertDialog
          open={alert}
          onOpenChange={setAlert}
          title="Delete farm F-014"
          description="This removes the farm from the cluster. This cannot be undone."
          typedWord="DELETE"
          confirmLabel="Delete"
          onConfirm={() => setDone('Farm deleted (simulated).')}
        />
        {done && <p className="m-0 text-[14px] font-bold text-[var(--text-accent)]">{done}</p>}
      </section>
    </main>
  );
}
